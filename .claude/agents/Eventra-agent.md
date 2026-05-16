---
name: eventra-project
description: Blueprint — Eventra
tools: Glob, Grep, LS, Read, WebFetch, TodoWrite, WebSearch, BashOutput, KillBash, Write
color: orange
---

# Blueprint — Eventra

## 1. Introducción

### 1.1. Propósito

Este documento describe el diseño funcional de una plataforma descentralizada de venta y reventa de entradas para eventos, basada en tecnología blockchain. Su finalidad es servir como referencia común entre el equipo técnico y la parte de negocio para alinear el alcance del producto antes de la fase de implementación.

### 1.2. Visión general

La plataforma permite a empresas organizadoras crear eventos y emitir entradas digitales como activos únicos y verificables (NFTs). Los compradores adquieren estas entradas con su wallet, las usan para acceder al evento y, opcionalmente, las revenden a otros compradores dentro de las reglas que la empresa organizadora haya fijado.

La propuesta de valor frente a una ticketera tradicional se apoya en cuatro funcionalidades clave:

- **Autenticidad demostrable**: cada entrada es un NFT cuya propiedad es verificable en la blockchain, eliminando falsificaciones.
- **Reventa controlada**: la empresa organizadora define al crear el evento las reglas de reventa (tope de precio, royalty por reventa).
- **Custodia de fondos configurable**: el dinero de las ventas no llega directamente a la empresa: queda en el contrato y se libera según el modelo configurado por evento (por compra, al final del evento, o por hitos).
- **Reembolso automático en caso de cancelación**: si la empresa cancela el evento, los compradores recuperan su dinero sin negociación ni intermediarios.

---

## 2. Descripción del sistema

### 2.1. General de la plataforma

La plataforma se compone de tres capas:

- **Contratos inteligentes**: concentran la lógica de creación de eventos, emisión y transferencia de entradas, custodia y liberación de fondos, y reembolsos.
- **Aplicación web (frontend)**: permite a los tres tipos de actor interactuar con los contratos de forma usable, conectando su wallet, navegando catálogos de eventos, comprando entradas y gestionando reventas.
- **Servicios off-chain de soporte**: almacenamiento de metadatos de los NFTs (imagen, descripción del evento) en IPFS o similar, servicio de envío de emails de confirmación, y proceso de verificación de identidad de las empresas organizadoras. *(POSIBLE ADICIÓN AL TERMINAR EL PROYECTO SI HAY TIEMPO)*

#### Estados principales del sistema

**Estados de empresa** *(SE REVISARÁ UNA VEZ TERMINADO EL PROYECTO SI ES VIABLE AÑADIRLO)*

- Pendiente de verificación
- Verificada
- Rechazada
- Suspendida

**Estados de evento**

- Activo
- Agotado
- Cancelado
- Finalizado

**Estados de entrada** (en referencia al ticket del usuario)

- Disponible
- Transferida
- En reventa
- Usada
- Cancelada
- Reembolsada

### 2.2. Ticket Buyers (compradores) — Características

El Ticket Buyer es cualquier persona que adquiere una entrada para asistir a un evento, con la posibilidad de revenderla antes del mismo.

Para operar en la plataforma necesita una wallet compatible (MetaMask, WalletConnect u otra). El registro tradicional con email/contraseña existe únicamente como capa de comodidad: permite recibir notificaciones del evento y recuperar acceso a la cuenta vinculada, pero no es lo que da derecho a la entrada. El derecho lo da la posesión del NFT en la wallet.

- **Privy**: librería para pagos con wallets "invisibles".
- Implementar MetaMask de base y revisar alguna otra implementación.

El Ticket Buyer puede comprar entradas tanto en venta primaria (directamente del evento) como en mercado secundario (de otro comprador que la revende). Puede revender sus propias entradas dentro de los límites que fijó la empresa al crear el evento. Puede consultar el historial de sus entradas y validar su autenticidad en cualquier momento.

El comprador no puede modificar las reglas de un evento, cancelar eventos, validar la entrada de otros asistentes, ni revender una entrada por encima del precio máximo establecido. Tampoco se puede revender una entrada una vez utilizada en el evento.

### 2.3. Event Company — Características

La Event Company es la entidad organizadora del evento.

La Event Company define al crear cada evento todos sus parámetros: nombre y descripción, fechas de inicio y fin de venta, fecha del evento, número total de entradas, tipos de entrada y precios, royalty de reventa (dentro de los límites globales del Administrador), tope de precio en reventa, y modelo de liberación de fondos.

La Event Company es responsable de validar las entradas el día del evento, mediante un proceso de check-in que marca cada NFT como "utilizado" para impedir su reuso o reventa posterior. Implementar un QR si el ticket es válido.

**Implementar el ERC-721.**

La Event Company puede cancelar un evento antes de su celebración, lo que dispara los reembolsos automáticos a todos los compradores. Puede consultar el estado de venta y los ingresos retenidos en cualquier momento. Una vez finalizado el evento con éxito, puede retirar los fondos acumulados según el modelo de liberación configurado.

La Event Company no puede modificar parámetros de un evento ya creado, alterar el contenido de una entrada ya emitida, impedir que un comprador autorizado revenda dentro de las reglas, ni retirar fondos antes de que se cumpla la condición de liberación configurada.

### 2.4. Administrador — Características

El Administrador es el responsable de la operación general de la plataforma. Su dirección queda fijada al desplegar los contratos y dispone de permisos especiales acotados a tareas de gobernanza, no de operación diaria.

El Administrador configura la comisión de la plataforma (porcentaje que se cobra sobre cada operación) y los límites globales dentro de los que las empresas pueden moverse: royalty máximo permitido, tope máximo de precio en reventa, y otros parámetros de protección del ecosistema. Los cambios en estos valores afectan únicamente a eventos creados a partir del cambio; los eventos en curso conservan los valores que fotografiaron en su creación.

El Administrador verifica y autoriza a las empresas organizadoras antes de que puedan crear eventos en la plataforma. Adicionalmente, *(decisión pendiente con negocio)* revisa y aprueba cada evento concreto antes de su publicación, comprobando que los datos declarados son coherentes con el evento real.

El Administrador puede retirar las comisiones acumuladas por la plataforma. Puede pausar el contrato en caso de incidencia grave (mecanismo de emergencia). Puede dar de baja a empresas que incumplan las normas.

El Administrador no puede modificar parámetros de eventos ya creados, acceder a los fondos retenidos por eventos que no le corresponden, suplantar a una empresa organizadora ni a un comprador, ni revertir transacciones legítimas.

---

## 3. Restricciones

### Restricciones técnicas

- La plataforma opera sobre una red EVM-compatible. El coste de cada operación (gas) recae sobre el actor que la inicia.
- Los parámetros de un evento, una vez emitidas las entradas, son inmutables por diseño del contrato.
- Las validaciones de seguridad (límites, permisos, estados) se ejecutan siempre on-chain. El frontend puede validar previamente como mejora de experiencia, pero no sustituye al check del contrato.

### Restricciones de negocio

- Las empresas organizadoras deben pasar un proceso de verificación antes de operar.
- El administrador define un porcentaje de royalty aplicado en la reventa. Ej: 5%.
- La comisión de la plataforma (Ej: 1%) se aplica en la compra de cada ticket.

---

## 4. Casos de uso

Los casos de uso describen las interacciones entre los actores y el sistema, detallando el comportamiento esperado de la plataforma bajo diferentes escenarios.

Cada caso de uso incluye: descripción, actores, precondiciones, flujo principal, flujos alternativos o excepciones, postcondiciones y requisitos especiales.

### 4.1. Casos de uso de usuarios

#### CU-01 — Registro de usuario

**Descripción**
Permite a una persona crear una cuenta en la plataforma.

**Actores**
- Usuario
- Sistema

**Precondiciones**
- El usuario debe disponer de un correo electrónico válido.
- El usuario no debe tener una cuenta registrada con el mismo correo electrónico.

**Flujo principal**
1. El usuario accede al formulario de registro.
2. Introduce correo electrónico y contraseña.
3. El sistema valida el formato de los datos.

**Flujos alternativos**
- *A1 — Correo ya registrado*: el sistema informa que ya existe una cuenta asociada.
- *A2 — Datos inválidos*: el sistema solicita corrección de información.

**Postcondiciones**
- La cuenta queda registrada y activa.
- El usuario puede iniciar sesión.

#### CU-02 — Inicio de sesión

**Descripción**
Permite autenticar un usuario.

**Actores**
- Usuario
- Sistema

**Precondiciones**
- El usuario debe tener una cuenta activa.

**Flujo principal**
1. El usuario introduce credenciales.
2. El sistema valida autenticación.
3. El sistema crea sesión activa.
4. El usuario accede a la plataforma.

**Flujos alternativos**
- *A1 — Credenciales incorrectas*: acceso denegado.

**Postcondiciones**
- El usuario queda autenticado.

#### CU-03 — Explorar eventos

**Descripción**
Permite consultar eventos disponibles.

**Actores**
- Usuario
- Sistema

**Precondiciones**
- El sistema debe disponer de eventos publicados.

**Flujo principal**
1. El usuario accede al catálogo.
2. El sistema muestra eventos disponibles.
3. El usuario filtra o busca eventos.
4. El usuario consulta detalles.

**Postcondiciones**
- El usuario visualiza información de eventos.

#### CU-04 — Comprar entrada

**Descripción**
Permite adquirir una entrada para un evento.

**Actores**
- Usuario
- Sistema

**Precondiciones**
- El usuario debe estar autenticado.
- El evento debe estar activo.
- Deben existir entradas disponibles.
- El usuario no debe haber superado el número máximo de tickets comprados.

**Flujo principal**
1. El usuario selecciona el evento.
2. El sistema verifica disponibilidad.
3. El usuario confirma la compra.
4. La pasarela procesa pagos.
5. El sistema recibe confirmación.
6. Se asigna NFT correspondiente.
7. Blockchain registra propiedad.
8. El usuario recibe confirmación.

**Flujos alternativos**
- *A1 — Entradas agotadas*: el sistema cancela operación.
- *A2 — Pago rechazado*: la compra no se completa.
- *A3 — Límite de entradas compradas alcanzado*: el sistema cancela operación.

**Postcondiciones**
- La entrada queda asociada al usuario.
- El stock del evento se actualiza.

#### CU-05 — Consultar entradas

**Descripción**
Permite visualizar entradas adquiridas.

**Actores**
- Usuario
- Sistema

**Precondiciones**
- El usuario debe tener entradas asociadas.
- El usuario está logueado.

**Flujo principal**
1. El usuario accede a "Mis entradas".
2. El sistema muestra:
   - entradas activas,
   - estado,
   - QR disponible al pulsar un botón,
   - información del evento.

**Postcondiciones**
- El usuario accede a sus entradas digitales.

**Requisitos especiales**
- Generación segura de QR dinámicos.
- Actualización en tiempo real del estado.

#### CU-06 — Revender entrada

**Descripción**
Permite publicar una entrada en el marketplace interno.

**Actores**
- Usuario
- Sistema

**Precondiciones**
- El usuario debe ser propietario actual.
- El evento debe estar activo.
- El estado de la entrada debe estar disponible.

**Flujo principal**
1. El usuario selecciona entrada.
2. Define precio.
3. El sistema valida restricciones.
4. La entrada se pone en estado "en reventa".
5. La entrada se publica.
6. Otro usuario compra.
7. Blockchain actualiza propiedad.
8. La entrada pasa a estado "Disponible" para el comprador y "Transferida" para el vendedor.
9. El vendedor recibe fondos.

**Postcondiciones**
- La entrada cambia de propietario.
- El marketplace se actualiza.

**Requisitos especiales**
- Aplicación automática de royalties.
- Prevención de fraude.
- Actualización inmediata de titularidad.

#### CU-07 — Transferir entrada

**Descripción**
Permite enviar una entrada a otro usuario.

**Actores**
- Usuario
- Sistema

**Precondiciones**
- El remitente debe ser propietario.
- La entrada debe estar Disponible.
- El destinatario debe tener una cuenta activa.

**Flujo principal**
1. El usuario selecciona entrada.
2. Introduce destinatario.
3. El sistema valida restricciones.
4. Blockchain ejecuta transferencia.
5. El destinatario recibe entrada.

**Flujos alternativos**
- *A1 — Usuario inexistente*: la transferencia se cancela.
- *A2 — Entrada inválida*: operación rechazada.

**Postcondiciones**
- Cambio de titularidad registrado.

**Requisitos especiales**
- Transferencia irreversible tras confirmación.
- Registro histórico de movimientos.

### 4.2. Casos de uso de empresas

#### CU-08 — Registro de empresa

**Descripción**
Permite registrar una empresa organizadora.

**Actores**
- Empresa
- Sistema
- Administrador

**Precondiciones**
- La empresa no debe estar registrada previamente.

**Flujo principal**
1. La empresa completa formulario.
2. El sistema registra solicitud.
3. Estado pasa a "pendiente".
4. Administrador revisa información.

**Postcondiciones**
- Empresa pendiente de validación.

#### CU-09 — Crear evento

**Descripción**
Permite publicar un evento.

**Actores**
- Empresa
- Sistema
- Blockchain

**Precondiciones**
- Empresa verificada.

**Flujo principal**
1. La empresa introduce datos del evento.
2. Configura entradas y precios.
3. Paga un depósito.
4. Publica evento.
5. El sistema genera NFTs.

**Flujos alternativos**
- *A1 — Empresa no verificada*: operación denegada.

**Postcondiciones**
- Evento disponible públicamente.
- Entradas generadas.

#### CU-10 — Consultar estadísticas

**Descripción**
Permite visualizar métricas de eventos.

**Actores**
- Empresa
- Sistema

**Precondiciones**
- La empresa debe tener eventos creados.

**Flujo principal**
1. La empresa accede al panel.
2. El sistema muestra:
   - ventas,
   - ingresos,
   - ocupación,
   - reventas,
   - asistentes.

**Postcondiciones**
- Estadísticas visualizadas correctamente.

**Requisitos especiales**
- Actualización casi en tiempo real.
- Exportación futura de informes.

#### CU-11 — Cancelar evento

**Descripción**
Permite cancelar un evento publicado.

**Actores**
- Empresa
- Sistema
- Pasarela de pago

**Precondiciones**
- El evento debe estar activo.

**Flujo principal**
1. La empresa solicita cancelación.
2. El sistema invalida entradas.
3. El evento pasa a "cancelado".
4. La empresa pierde el depósito.

**Postcondiciones**
- Entradas invalidadas.
- Reembolsos habilitados.
- Pérdida del depósito.

#### CU-12 — Liberación de fondos

**Descripción**
Permite retirar los fondos de un evento publicado.

**Actores**
- Empresa
- Sistema
- Pasarela de pago

**Precondiciones**
- El evento debe estar finalizado.
- Existen los fondos retenidos asociados a un evento.

**Flujo principal**
1. La empresa solicita la retirada de los fondos.
2. El sistema comprueba el estado del evento.
3. El sistema envía los fondos a la empresa.
4. El sistema elimina el evento de la plataforma.

**Flujos alternativos**
- *A1 — Evento no finalizado*: operación denegada.
- *A2 — Fondos inexistentes*: operación denegada.

**Postcondiciones**
- La empresa recibe los fondos.

### 4.3. Casos de uso de administradores

#### CU-13 — Suspender cuenta

**Descripción**
Permite bloquear usuarios o empresas.

**Actores**
- Administrador
- Sistema

**Precondiciones**
- La cuenta debe existir.

**Flujo principal**
1. El administrador selecciona cuenta.
2. Define motivo.
3. El sistema bloquea acceso.
4. Se registra acción.

**Postcondiciones**
- Cuenta suspendida.

**Requisitos especiales**
- Historial de suspensiones.
- Notificación automática al afectado.

---

## 5. Conexiones con sistemas externos

- **Wallets**: conexión vía estándares WalletConnect / EIP-1193 para soportar MetaMask, Rainbow, WalletConnect, etc.
- **Almacenamiento descentralizado**: IPFS o Arweave para los metadatos de los NFTs (imagen del evento, atributos, descripción).
- **Exploradores de bloques**: enlaces directos en la UI a las transacciones para que el usuario pueda verificarlas (Etherscan o equivalente según la red).
- **Generador de QR firmados**: para el flujo de check-in. Puede ser una librería del propio frontend, no necesariamente un servicio externo.