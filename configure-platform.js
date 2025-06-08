## ARCHIVO 1: configure-platform.js

```javascript
#!/usr/bin/env node

/**
 * Script de Configuración de Plataforma
 * Convierte WUP Awards en un template genérico para cualquier organización
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function hacerPregunta(pregunta) {
  return new Promise((resolve) => {
    rl.question(pregunta, (respuesta) => {
      resolve(respuesta);
    });
  });
}

async function configurarPlataforma() {
  console.log('🏆 Configuración del Template de Premios');
  console.log('=====================================\n');

  // Recopilar detalles de la organización
  const nombreOrg = await hacerPregunta('Nombre de la organización: ');
  const nombrePlataforma = await hacerPregunta('Nombre de la plataforma de premios: ');
  const descripcion = await hacerPregunta('Descripción de la plataforma: ');
  const colorPrimario = await hacerPregunta('Color primario (hex, ej: #3B82F6): ');
  
  console.log('\n🔧 Aplicando configuración...\n');

  // 1. Actualizar package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.name = nombrePlataforma.toLowerCase().replace(/\s+/g, '-') + '-premios';
  packageJson.description = descripcion;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('✓ package.json actualizado');

  // 2. Crear configuración de marca
  const configMarca = `// Configuración de marca de la plataforma
export const CONFIG_PLATAFORMA = {
  organizacion: {
    nombre: "${nombreOrg}",
    plataforma: "${nombrePlataforma}",
    descripcion: "${descripcion}"
  },
  marca: {
    colorPrimario: "${colorPrimario}",
    rutaLogo: "/logo.png"
  }
};
`;

  // Asegurar que existe el directorio client/src/lib
  const dirLib = 'client/src/lib';
  if (!fs.existsSync(dirLib)) {
    fs.mkdirSync(dirLib, { recursive: true });
  }

  fs.writeFileSync(path.join(dirLib, 'config.ts'), configMarca);
  console.log('✓ Configuración de marca creada');

  // 3. Actualizar página de inicio
  if (fs.existsSync('client/src/pages/landing.tsx')) {
    let contenidoLanding = fs.readFileSync('client/src/pages/landing.tsx', 'utf8');
    
    // Reemplazar contenido específico de WUP con contenido genérico
    contenidoLanding = contenidoLanding.replace(/World Urban Parks/g, nombreOrg);
    contenidoLanding = contenidoLanding.replace(/WUP Awards/g, nombrePlataforma);
    contenidoLanding = contenidoLanding.replace(/WUP@10/g, nombrePlataforma);
    
    fs.writeFileSync('client/src/pages/landing.tsx', contenidoLanding);
    console.log('✓ Página de inicio actualizada');
  }

  // 4. Actualizar README
  const contenidoReadme = `# ${nombrePlataforma}

## Descripción
${descripcion}

Construido con el Template de Plataforma de Premios - una solución completa para gestionar programas de premios.

## Características
- Gestión de múltiples programas de premios
- Constructor dinámico de formularios
- Control de acceso basado en roles
- Sistema avanzado de evaluación
- Subida de archivos y gestión de documentos
- Dashboard en tiempo real y analíticas
- Gestión de regiones geográficas
- Selección de ganadores y resultados

## Inicio Rápido

1. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

2. Configurar variables de entorno:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Configurar base de datos:
\`\`\`bash
npm run db:push
\`\`\`

4. Iniciar servidor de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

## Despliegue

Esta plataforma puede desplegarse en:
- Railway (recomendado)
- Vercel + Supabase
- Hosting VPS tradicional
- Contenedores Docker

## Configuración

Ejecuta el asistente de configuración para personalizar para tu organización:
\`\`\`bash
node configure-platform.js
\`\`\`

## Soporte

Para soporte técnico y servicios de personalización, contacta [tu-email@dominio.com]

---

*Desarrollado con Template de Plataforma de Premios*
`;

  fs.writeFileSync('README.md', contenidoReadme);
  console.log('✓ README actualizado');

  // 5. Crear template de entorno
  const templateEnv = `# Configuración de Base de Datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/bd_premios

# Configuración de Email (opcional)
SENDGRID_API_KEY=tu_clave_sendgrid
FROM_EMAIL=noreply@tuplataforma.com

# Configuración de Sesión
SESSION_SECRET=tu_clave_secreta_super_segura_aquí

# Configuración de Plataforma
PLATFORM_NAME="${nombrePlataforma}"
ORGANIZATION_NAME="${nombreOrg}"
`;

  fs.writeFileSync('.env.example', templateEnv);
  console.log('✓ Template de entorno creado');

  // 6. Crear instrucciones de despliegue
  const instruccionesDespliegue = `# Guía de Despliegue

## Despliegue en Railway (Recomendado)

1. Sube tu código a GitHub
2. Conecta Railway a tu repositorio
3. Configura variables de entorno en el dashboard de Railway
4. Despliega automáticamente

## Variables de Entorno Requeridas:
- DATABASE_URL (proporcionada por PostgreSQL de Railway)
- SESSION_SECRET (genera una cadena aleatoria)
- SENDGRID_API_KEY (opcional, para emails)
- FROM_EMAIL (opcional, para emails)

## Configuración de Dominio Personalizado
1. Añade tu dominio en el dashboard de Railway
2. Actualiza registros DNS según las instrucciones
3. Los certificados SSL son automáticos

## Lista de Verificación de Producción
- [ ] Variables de entorno configuradas
- [ ] Base de datos inicializada con datos de muestra
- [ ] Usuario administrador creado
- [ ] Notificaciones por email probadas
- [ ] Dominio personalizado configurado
- [ ] Estrategia de respaldos implementada
`;

  fs.writeFileSync('DESPLIEGUE.md', instruccionesDespliegue);
  console.log('✓ Guía de despliegue creada');

  console.log('\n🎉 ¡Configuración completada exitosamente!\n');
  
  console.log('📋 Próximos Pasos:');
  console.log('1. Reemplaza /public/logo.png con el logo de tu organización');
  console.log('2. Revisa y personaliza client/src/pages/landing.tsx');
  console.log('3. Configura variables de entorno (archivo .env)');
  console.log('4. Prueba localmente: npm run dev');
  console.log('5. Despliega a producción usando la guía DESPLIEGUE.md');
  
  console.log('\n🚀 ¡Tu template de plataforma de premios está listo!');
  
  rl.close();
}

// Ejecutar configuración
configurarPlataforma().catch(console.error);
```

===============================
