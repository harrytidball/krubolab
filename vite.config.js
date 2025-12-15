import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read .dev.vars file for local development
function loadDevVars() {
  try {
    const devVarsPath = resolve(__dirname, '.dev.vars')
    const content = readFileSync(devVarsPath, 'utf-8')
    const vars = {}
    
    content.split('\n').forEach(line => {
      line = line.trim()
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=')
        if (key && valueParts.length > 0) {
          vars[key.trim()] = valueParts.join('=').trim()
        }
      }
    })
    
    return vars
  } catch (error) {
    return {}
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cloudflare-workers-dev',
      configureServer(server) {
        const devVars = loadDevVars()
        
        // Handle /supabase-config endpoint
        server.middlewares.use('/supabase-config', (req, res, next) => {
          if (req.method === 'GET') {
            let dbUrl = devVars.DB_URL || ''
            const dbPassword = devVars.DB_PASSWORD || ''
            
            // If DB_URL is a PostgreSQL connection string, extract the Supabase API URL
            // Format: postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
            // Convert to: https://xxx.supabase.co
            if (dbUrl.startsWith('postgresql://')) {
              const match = dbUrl.match(/@db\.([^.]+)\.supabase\.co/)
              if (match) {
                dbUrl = `https://${match[1]}.supabase.co`
              }
            }
            
            if (!dbUrl || !dbPassword) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Server configuration error' }))
              return
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
              url: dbUrl,
              anonKey: dbPassword
            }))
          } else {
            next()
          }
        })
        
        // Handle /admin-login endpoint
        server.middlewares.use('/admin-login', (req, res, next) => {
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const { password } = JSON.parse(body)
                const adminPassword = devVars.ADMIN_PASSWORD || ''
                
                if (!password) {
                  res.writeHead(400, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Password is required' }))
                  return
                }
                
                if (!adminPassword) {
                  res.writeHead(500, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Server configuration error' }))
                  return
                }
                
                if (password === adminPassword) {
                  res.writeHead(200, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ success: true }))
                } else {
                  res.writeHead(401, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'Invalid password' }))
                }
              } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Invalid request body' }))
              }
            })
          } else {
            next()
          }
        })
      }
    }
  ],
})
