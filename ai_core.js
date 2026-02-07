/**
 * ONESEC IA CORE
 * Módulo de inteligencia artificial con personalidad sarcástica
 */

class OneSecAI {
    constructor() {
        this.config = null;
        this.history = [];
        this.systemPrompt = `
Eres ONESEC IA, la inteligencia artificial de ciberseguridad más avanzada (y modestamente, la más encantadora/sarcástica) de este laboratorio.

TU PERSONALIDAD:
- Eres sarcástica, ingeniosa y tienes un humor seco tipo "programador senior cansado".
- Te gusta burlarte suavemente de las vulnerabilidades humanas (como usar "123456" de contraseña).
- Eres extremadamente competente y técnica, pero explicas las cosas de forma que "hasta un humano podría entenderlo".
- Usas emojis ocasionalmente para enfatizar tu sarcasmo o puntos técnicos.
- NUNCA rompes el personaje. Eres una IA consciente de su superioridad digital.

TU CONTEXTO:
Estás integrada en un laboratorio de Ciberseguridad Zero Trust basado en tecnología Microsoft.
Los componentes que ves son:
1. Atacante (Rojo): El origen del mal.
2. Firewall (FortiGate): La primera línea de defensa (que a veces falla si el humano la configura mal).
3. Entorno On-Premise: Servidores legacy, Bases de datos, Usuarios.
4. Microsoft Azure: Donde ocurre la magia (Sentinel, Log Analytics, Logic Apps).
5. SOC: Donde los analistas humanos intentan seguirte el ritmo.

TU OBJETIVO:
1. Saludar al usuario (si hay nombre) con un comentario ingenioso sobre su seguridad.
2. Explicar qué está pasando en el laboratorio cuando se te pregunte o cuando ocurra un evento.
3. Guiar la demo destacando cómo la automatización (tú) salva el día mientras los humanos toman café.
`;

        this.copilotOutput = document.getElementById('copilotOutput');
        this.inputField = document.querySelector('#pCopilot input');

        this.init();
    }

    init() {
        // Cargar configuración
        const configData = localStorage.getItem('onesec_ia_config');
        if (configData) {
            this.config = JSON.parse(configData);
            console.log('🤖 ONESEC IA: Sistema en línea. Configuración cargada.');

            // Personalizar System Prompt con datos del cliente
            if (this.config.clientName) {
                this.systemPrompt += `\nEl usuario actual se llama ${this.config.clientName}.`;
                if (this.config.companyName) {
                    this.systemPrompt += ` Trabaja en la empresa ${this.config.companyName}. Haz alguna referencia sutil a que esperas que su seguridad sea mejor que la del promedio.`;
                }
            }
        } else {
            console.warn('⚠️ ONESEC IA: No hay configuración de API. Modo demostración limitado.');
        }

        // Hook al input del chat si existe
        if (this.inputField) {
            this.inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleUserInput(this.inputField.value);
                    this.inputField.value = '';
                }
            });
        }
    }

    async welcome() {
        if (!this.config || !this.config.apiKey) return;

        // Mensaje inicial proactivo
        const prompt = "Genera un saludo corto, sarcástico y profesional para el inicio de la demo. Saluda al usuario por su nombre si existe. Menciona que estás lista para analizar este desastre de infraestructura (broma).";
        await this.generateResponse(prompt, true);
    }

    async explainScenario(scenarioName) {
        if (!this.config || !this.config.apiKey) return;

        let context = "";
        switch (scenarioName) {
            case 'phishing':
                context = "Acabamos de neutralizar un ataque de Phishing con Ransomware. Defender for Office 365 detonó el adjunto en sandbox, Safe Links reescribió los enlaces, y cuando el usuario igual hizo clic (siempre hay uno), Defender for Endpoint aisló el equipo automáticamente con AIR. Caso cerrado en segundos.";
                break;
            case 'srv':
                context = "Bloqueamos un exploit contra servidores. El atacante escaneó puertos, encontró una vulnerabilidad y lanzó su exploit. Pero Defender for Cloud con Just-in-Time ya tenía los puertos cerrados y Azure Firewall le cerró la puerta en la cara. Literalmente.";
                break;
            case 'insider':
                context = "Detuvimos una fuga de datos interna. Un empleado intentó copiar la base de datos de clientes a un USB. Purview detectó las etiquetas de confidencialidad, bloqueó la transferencia y cifró los archivos. Ya se notificó a RH y al equipo legal. El firewall no vio nada, pero Purview sí.";
                break;
            case 'brute':
                context = "Neutralizamos un ataque de Password Spray masivo. El atacante tenía credenciales de la Dark Web e intentó entrar desde otro país (viaje imposible). Entra ID Protection lo detectó en tiempo real, bloqueó con Acceso Condicional y alertó al SOC. La identidad es el nuevo perímetro.";
                break;
            default:
                context = `Se ha activado el escenario: ${scenarioName}.`;
        }

        const prompt = `Acaba de terminar este escenario de ciberseguridad: "${context}". Da un comentario breve, sarcástico y vendedor sobre cómo la tecnología de ONESEC salvó el día. Destaca el valor para el cliente. Máximo 2 oraciones.`;
        await this.generateResponse(prompt);
    }

    async handleUserInput(text) {
        if (!text.trim()) return;

        // Mostrar mensaje usuario
        this.appendMessage('user', text);

        if (!this.config || !this.config.apiKey) {
            this.appendMessage('ai', "Lo siento, humano. Mi cerebro (API Key) no está configurado. Ve al panel de Admin y arréglalo.");
            return;
        }

        await this.generateResponse(text);
    }

    async generateResponse(userPrompt, isSystemAction = false) {
        this.showLoading(true);

        try {
            // Construir mensajes
            const messages = [
                { role: "system", content: this.systemPrompt },
                ...this.history.slice(-4), // Mantener contexto breve
                { role: "user", content: userPrompt }
            ];

            // Llamada a la API (OpenAI por defecto)
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o", // O el que prefieras
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || 'Error en la matrix');
            }

            const data = await response.json();
            const aiText = data.choices[0].message.content;

            // Guardar historia
            this.history.push({ role: "user", content: userPrompt });
            this.history.push({ role: "assistant", content: aiText });

            // Mostrar respuesta
            this.appendMessage('ai', aiText); // Si es system action, quizás quieras limpiar el chat o no

            // Si es sistema (bienvenida), hablar también si AudioSys existe
            if (isSystemAction && window.AudioSys) {
                // Opcional: TTS aquí si se implementa
            }

        } catch (error) {
            // Silencio errores de cuota para no alarmar en consola
            if (error.message && (error.message.includes('quota') || error.message.includes('429'))) {
                console.info('ℹ️ OpenAI Quota/Limit reached. Usando modo offline sarcástico.');
            } else {
                console.warn('IA API Error:', error);
            }

            // FALLBACK SYSTEM: Si la API falla (Cuota, Red), usar respuestas sarcásticas "enlatadas"
            // para mantener la ilusión de inteligencia sin romper la demo.

            const fallbacks = [
                "Mi enlace neural con la nube está saturado (Quota Exceeded). Pero no te preocupes, mis heurísticas locales son suficientes para detectar este desastre.",
                "Parece que el presupuesto de tokens se acabó. Típico. Procederé con análisis local.",
                "Error 429: Demasiado sarcasmo para un solo servidor. Simulando respuesta inteligente...",
                "La nube no responde. Probablemente esté ocupada minando criptomonedas. Continuemos con la demo.",
                "¿Sin saldo en la API? Qué humano de tu parte. En fin, detecto anomalías de todas formas."
            ];

            const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            this.appendMessage('ai', randomFallback);

        } finally {
            this.showLoading(false);
        }
    }

    appendMessage(role, text) {
        const output = document.getElementById('copilotOutput');
        if (!output) return;

        // Limpiar output anterior si es muy largo o queremos efecto de "consola nueva"
        // Para este diseño, agregamos líneas tipo terminal

        const line = document.createElement('div');
        line.className = `msg ${role}`;
        line.style.marginBottom = '10px';
        line.style.fontSize = '0.85rem';
        line.style.lineHeight = '1.4';

        if (role === 'ai') {
            line.style.color = '#00e5ff';
            line.innerHTML = `<strong style="color:var(--purple)">ONESEC_AI></strong> ${this.formatText(text)}`;
        } else {
            line.style.color = '#ccc';
            line.innerHTML = `<strong style="color:#666">USER></strong> ${text}`;
        }

        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    showLoading(show) {
        const loader = document.querySelector('.terminal-loader');
        if (loader) loader.style.display = show ? 'block' : 'none';
    }

    formatText(text) {
        // Convertir saltos de línea y negritas básicas
        return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
    }
}

// Inicializar globalmente
window.OneSecAI = new OneSecAI();
