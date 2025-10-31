import { GoogleGenAI } from "@google/genai";

// Declare global variables from CDN scripts for TypeScript
declare const marked: any;
declare const Chart: any;

document.addEventListener('DOMContentLoaded', () => {
    const paradigmDescriptions: { [key: string]: string } = {
        'Planteamiento': '<strong>Acto I (Planteamiento):</strong> Presenta el mundo, los personajes y el conflicto inicial. Dura aproximadamente las primeras 25-30 páginas del guion.',
        'Primer Nudo': '<strong>Primer Nudo de Trama:</strong> Ocurre al final del Acto I. Es un evento que engancha al protagonista y lo lanza en una nueva dirección, definiendo el objetivo principal de la historia.',
        'Confrontación': '<strong>Acto II (Confrontación):</strong> La parte más larga. El protagonista enfrenta obstáculos crecientes en busca de su objetivo. Contiene el "Punto Medio", un giro que cambia la dinámica.',
        'Segundo Nudo': '<strong>Segundo Nudo de Trama:</strong> Ocurre al final del Acto II. Es el punto más bajo para el protagonista, donde todo parece perdido, forzándolo a un último esfuerzo desesperado.',
        'Resolución': '<strong>Acto III (Resolución):</strong> El clímax y la conclusión. El protagonista se enfrenta a la confrontación final y se resuelve la historia, mostrando el nuevo equilibrio en su vida.'
    };
    
    const analysisData: { [key: string]: { [key: string]: string } } = {
        field: {
            air: `<h4 class="text-xl font-bold mb-4 text-gray-800">Análisis de 'Air' según Syd Field</h4><ul class="space-y-3 text-gray-700"><li><strong>Acto I:</strong> Se establece el mundo de Nike en 1984, una empresa en decadencia en el baloncesto. El protagonista, Sonny Vaccaro, está frustrado. El <strong>incidente incitador</strong> es la tarea de encontrar un nuevo rostro para la división de baloncesto.</li><li><strong>Primer Nudo de Trama:</strong> Sonny decide, en contra de todos, que apostará todo el presupuesto en un solo jugador: Michael Jordan. Esto define su objetivo y lo pone en conflicto directo con Nike.</li><li><strong>Acto II:</strong> Sonny enfrenta múltiples obstáculos: convencer a su jefe, al CEO de Nike, al agente de Jordan y, finalmente, a la familia Jordan. El <strong>punto medio</strong> es su viaje no autorizado a Carolina del Norte para hablar directamente con los padres de Jordan.</li><li><strong>Segundo Nudo de Trama:</strong> Justo cuando parece que tiene un acuerdo, el agente de Jordan, David Falk, le informa que Adidas ha igualado la oferta y Jordan podría elegirla. Todo el esfuerzo de Sonny parece haber sido en vano.</li><li><strong>Acto III:</strong> El <strong>clímax</strong> es la reunión final en Nike, donde Sonny da su apasionado discurso sobre la grandeza de Jordan, conectando con él a un nivel personal. La <strong>resolución</strong> es Jordan firmando con Nike, creando la icónica línea Air Jordan.</li></ul>`,
            barbie: `<h4 class="text-xl font-bold mb-4 text-gray-800">Análisis de 'Barbie' según Syd Field</h4><ul class="space-y-3 text-gray-700"><li><strong>Acto I:</strong> Se presenta Barbieland, un mundo perfecto. Barbie Estereotípica vive una vida ideal. El <strong>incidente incitador</strong> es cuando empieza a tener pensamientos sobre la muerte y sus pies se vuelven planos.</li><li><strong>Primer Nudo de Trama:</strong> Barbie Rara le dice que debe viajar al Mundo Real para encontrar a la niña que juega con ella y reparar la brecha entre los dos mundos. Este es su llamado a la aventura.</li><li><strong>Acto II:</strong> Barbie y Ken viajan al Mundo Real, enfrentando el choque cultural del patriarcado. Descubre que no es un modelo a seguir como pensaba. El <strong>punto medio</strong> es cuando se da cuenta de que la fuente del problema es Gloria, una adulta en Mattel, no una niña.</li><li><strong>Segundo Nudo de Trama:</strong> Barbie regresa a Barbieland y lo encuentra transformado en el "Kendom" patriarcal. Las otras Barbies han sufrido un lavado de cerebro y ella se siente una impostora, perdiendo toda esperanza.</li><li><strong>Acto III:</strong> El <strong>clímax</strong> es el plan para "desprogramar" a las Barbies y la "guerra" de los Kens, culminando en el monólogo de Gloria que restaura la confianza de Barbie. La <strong>resolución</strong> es Barbie eligiendo convertirse en humana y abandonar la idea de perfección.</li></ul>`,
            mario: `<h4 class="text-xl font-bold mb-4 text-gray-800">Análisis de 'Super Mario Bros' según Syd Field</h4><ul class="space-y-3 text-gray-700"><li><strong>Acto I:</strong> Se presenta a los hermanos Mario y Luigi, plomeros de Brooklyn que luchan por el respeto. El <strong>incidente incitador</strong> es cuando una misteriosa tubería verde los absorbe mientras intentan arreglar una fuga de agua masiva.</li><li><strong>Primer Nudo de Trama:</strong> Mario aterriza en el Reino Champiñón, pero Luigi es capturado por Bowser. El objetivo de Mario queda claro: debe rescatar a su hermano.</li><li><strong>Acto II:</strong> Mario, con la ayuda de Toad y la Princesa Peach, se embarca en un viaje para formar un ejército. Enfrenta pruebas como el entrenamiento de Peach y la batalla con Donkey Kong. El <strong>punto medio</strong> es ganar el respeto de Cranky Kong y asegurar la ayuda de su ejército.</li><li><strong>Segundo Nudo de Trama:</strong> El plan de ataque en la Senda Arcoíris fracasa estrepitosamente. Bowser captura a todo el ejército y se dirige a casarse con Peach para obtener el poder de la Superestrella. Todo parece perdido.</li><li><strong>Acto III:</strong> El <strong>clímax</strong> ocurre en Brooklyn, donde la batalla final tiene lugar. Mario y Luigi, trabajando juntos y usando la Superestrella, derrotan a Bowser. La <strong>resolución</strong> es que son aclamados como héroes en su ciudad natal y deciden quedarse en el Reino Champiñón.</li></ul>`
        },
        mckee: {
            air: `<h4 class="text-xl font-bold mb-4 text-gray-800">Análisis de 'Air' según Robert McKee</h4><p class="mb-4 text-gray-600">'Air' es un ejemplo perfecto del 'Architrama' de McKee. La historia se centra en un protagonista activo (Sonny) que lucha contra fuerzas antagonistas externas (competencia, su propia empresa) e internas (sus dudas) en una búsqueda de su objetivo.</p><ul class="space-y-3 text-gray-700"><li><strong>Incidente Incitador:</strong> No es la tarea de buscar un jugador, sino el momento en que Sonny ve una cinta de Jordan y tiene la epifanía de que él es el único. Esto rompe el equilibrio de su vida profesional.</li><li><strong>Brecha entre Expectativa y Resultado:</strong> Sonny espera que su genial idea sea aclamada, pero el resultado es el escepticismo de todos. Viaja para ver a los padres de Jordan esperando cerrar un trato, pero el resultado es que solo consigue una reunión. Cada acción crea una reacción inesperada que aumenta la tensión.</li><li><strong>Crisis, Clímax y Resolución:</strong> La <strong>crisis</strong> es la elección final de Sonny: ¿deja que Jordan se vaya a Adidas o rompe todas las reglas y apela directamente a su humanidad en la reunión final? Elige lo segundo. El <strong>clímax</strong> es su discurso, que no habla de zapatillas, sino del legado y la grandeza. La <strong>resolución</strong> es la creación de una leyenda que cambia el marketing deportivo para siempre.</li></ul>`,
            barbie: `<h4 class="text-xl font-bold mb-4 text-gray-800">Análisis de 'Barbie' según Robert McKee</h4><p class="mb-4 text-gray-600">La película sigue una estructura clásica pero la enriquece con una profunda exploración del personaje. El conflicto principal no es externo (derrotar a los Kens), sino interno: la lucha de Barbie con su propia identidad.</p><ul class="space-y-3 text-gray-700"><li><strong>Incidente Incitador:</strong> Los pensamientos sobre la muerte son el primer evento que rompe el equilibrio perfecto y estático de su vida, introduciendo el conflicto central: la disonancia entre la perfección idealizada y la compleja realidad.</li><li><strong>Complicaciones Progresivas:</strong> El viaje al Mundo Real no simplifica las cosas, las complica. Cada descubrimiento sobre el patriarcado y la propia irrelevancia de Barbie aumenta la brecha entre su expectativa (ser amada) y el resultado (ser ignorada o ridiculizada).</li><li><strong>Crisis, Clímax y Resolución:</strong> La <strong>crisis</strong> es el momento en que Barbie, derrotada en el Kendom, decide si vale la pena luchar por un mundo y una identidad que ya no entiende. Elige luchar. El <strong>clímax</strong> es su decisión de aceptar la imperfección y liderar a las Barbies. La <strong>resolución</strong> es su transformación en humana, un cambio de valor fundamental y el nacimiento de un nuevo ser.</li></ul>`,
            mario: `<h4 class="text-xl font-bold text-gray-800">Análisis de 'Super Mario Bros' según Robert McKee</h4><p class="mb-4 text-gray-600">La película es un ejemplo de trama minimalista y orientada a la acción, donde el objetivo es claro y el conflicto es principalmente físico y externo. La profundidad emocional reside en la relación fraternal.</p><ul class="space-y-3 text-gray-700"><li><strong>Incidente Incitador:</strong> La separación de los hermanos al ser absorbidos por la tubería. Esto establece el objetivo principal de Mario (rescatar a Luigi) y el de Luigi (sobrevivir).</li><li><strong>Brecha entre Expectativa y Resultado:</strong> Constantemente, Mario espera superar un obstáculo con sus habilidades de plomero, pero el resultado es que necesita aprender las reglas del nuevo mundo. Entrena esperando ser un héroe instantáneo, pero el resultado es que es superado por Peach y Donkey Kong, forzándolo a ser más astuto.</li><li><strong>Crisis, Clímax y Resolución:</strong> La <strong>crisis</strong> es cuando Mario ve a Luigi siendo torturado y debe decidir si se rinde o sigue luchando a pesar de la desventaja. Elige luchar. El <strong>clímax</strong> es la batalla final en Brooklyn, donde solo juntos pueden derrotar a Bowser. La <strong>resolución</strong> es que son aclamados como héroes en su ciudad natal y deciden quedarse en el Reino Champiñón.</li></ul>`
        },
        sugarman: {
            air: `<h4 class="text-xl font-bold mb-4 text-gray-800">Análisis de 'Air' según Joseph Sugarman</h4><p class="mb-4 text-gray-600">'Air' no es sobre vender zapatillas, es sobre vender una idea: la creencia en el potencial humano. Utiliza los disparadores de Sugarman para que el público invierta emocionalmente en el éxito de Nike.</p><ul class="space-y-3 text-gray-700"><li><strong>Contar una Historia:</strong> Es la clásica historia del "underdog". Nike es la empresa pequeña luchando contra los gigantes (Adidas, Converse). Sonny es el visionario solitario contra su propia burocracia.</li><li><strong>Establecer Autoridad:</strong> La película establece la autoridad de Sonny como un genio del baloncesto. Muestra la autoridad de Phil Knight como un líder poco convencional y la de la Sra. Jordan como la guardiana del destino de su hijo.</li><li><strong>Apelar a la Emoción:</strong> El motor de la película es la pasión. La frustración de Sonny, su fe ciega en Jordan, el amor de una madre por su hijo. El clímax es un discurso puramente emocional.</li><li><strong>Justificar la Conexión:</strong> La película justifica nuestra inversión emocional mostrando el resultado: el nacimiento de una marca icónica y un fenómeno cultural. Nos da la lógica ("fue una decisión de negocios brillante") para validar la emoción que sentimos.</li></ul>`,
            barbie: `<h4 class="text-xl font-bold mb-4 text-gray-800">Análisis de 'Barbie' según Joseph Sugarman</h4><p class="mb-4 text-gray-600">La película es una clase magistral de cómo una marca puede contar una historia sobre sí misma, reconociendo sus críticas para conectar a un nivel más profundo y auténtico.</p><ul class="space-y-3 text-gray-700"><li><strong>Contar una Historia:</strong> La película cuenta la historia de la "idea" de Barbie y su lucha por encontrar relevancia en el mundo moderno. Es una historia de autodescubrimiento y empoderamiento.</li><li><strong>Establecer Autoridad:</strong> Irónicamente, lo logra al principio derribando su propia autoridad (mostrando a los ejecutivos de Mattel como tontos) para luego reconstruirla sobre una base más honesta. La nueva autoridad de la marca reside en su capacidad de evolucionar.</li><li><strong>Apelar a la Emoción:</strong> Apela a la nostalgia de quienes jugaron con Barbie, a la frustración de las mujeres en una sociedad patriarcal (el monólogo de Gloria) y a la universal búsqueda de identidad.</li><li><strong>Justificar la Conexión:</strong> Justifica la compra de una entrada (y de una muñeca) no como un acto de consumismo, sino como el apoyo a un mensaje: que las mujeres (y las ideas) pueden ser cualquier cosa.</li></ul>`,
            mario: `<h4 class="text-xl font-bold mb-4 text-gray-800">Análisis de 'Super Mario Bros' según Joseph Sugarman</h4><p class="mb-4 text-gray-600">Esta película es un ejercicio de pura conexión de marca a través de la alegría y la aventura, utilizando la narrativa para reforzar los valores que los jugadores ya asocian con Nintendo.</p><ul class="space-y-3 text-gray-700"><li><strong>Contar una Historia:</strong> Una historia simple y universal: el viaje del héroe y el rescate. Es fácil de seguir y emocionalmente satisfactoria, reflejando la estructura de un videojuego.</li><li><strong>Establecer Autoridad:</strong> La autoridad de Nintendo se demuestra a través de la fidelidad obsesiva al material de origen. Cada sonido, cada power-up, cada personaje grita "autenticidad". Le dice a los fans: "Confiad en nosotros, entendemos lo que amáis".</li><li><strong>Apelar a la Emoción:</strong> La película se basa en la nostalgia, la emoción de la aventura, el humor y, sobre todo, el vínculo fraternal entre Mario y Luigi. La emoción es la alegría de la experiencia.</li><li><strong>Justificar la Conexión:</strong> La justificación es simple: entretenimiento puro. Al ofrecer una experiencia divertida y fiel, la película refuerza la idea de que Nintendo es sinónimo de diversión de alta calidad, validando décadas de lealtad a la marca.</li></ul>`
        }
    };

    let currentMaster: string | null = null;
    let currentMovie: string | null = null;

    const mastersNav = document.getElementById('masters-nav');
    const movieNav = document.getElementById('movie-nav');
    const analysisOutput = document.getElementById('analysis-output-content');
    
    mastersNav.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('master-btn')) {
            currentMaster = target.dataset.master;
            updateActiveButton(mastersNav, target, 'active-master');
            showTheoryContent(currentMaster);
            updateAnalysis();
        }
    });

    movieNav.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('movie-btn')) {
            currentMovie = target.dataset.movie;
            updateActiveButton(movieNav, target, 'active-movie');
            updateAnalysis();
        }
    });

    function updateActiveButton(nav: HTMLElement, button: HTMLElement, activeClass: string) {
        nav.querySelectorAll('button').forEach(btn => btn.classList.remove(activeClass));
        button.classList.add(activeClass);
    }

    function showTheoryContent(master: string) {
        document.querySelectorAll('.theory-content').forEach(el => el.classList.remove('visible'));
        const theoryEl = document.getElementById(`${master}-theory`);
        if(theoryEl) {
            theoryEl.classList.add('visible');
        }
    }

    function updateAnalysis() {
        analysisOutput.style.opacity = '0';
        setTimeout(() => {
            if (currentMaster && currentMovie) {
                const data = analysisData[currentMaster]?.[currentMovie] || `<div class="text-center text-gray-500 py-12"><h3 class="mt-2 text-sm font-semibold text-gray-900">Análisis no disponible</h3><p class="mt-1 text-sm text-gray-500">No hay un análisis de ${currentMovie} para la teoría de ${currentMaster}.</p></div>`;
                analysisOutput.innerHTML = data;
            }
            analysisOutput.style.opacity = '1';
        }, 400);
    }

    document.querySelectorAll('.paradigm-point').forEach(point => {
        point.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const pointName = target.dataset.point;
            const infoBox = document.getElementById('paradigm-info');
            infoBox.style.opacity = '0';
            setTimeout(() => {
                infoBox.innerHTML = paradigmDescriptions[pointName];
                infoBox.style.opacity = '1';
            }, 300);
        });
    });
    
    const ctx = (document.getElementById('synthesisChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Estructura Clásica (Field)', 'Profundidad de Personaje (McKee)', 'Complejidad de Trama', 'Apelación Emocional (Sugarman)', 'Fidelidad a la Marca'],
            datasets: [{
                label: 'Air',
                data: [9, 7, 6, 9, 8],
                backgroundColor: 'rgba(74, 144, 138, 0.2)',
                borderColor: 'rgba(74, 144, 138, 1)',
                borderWidth: 2
            }, {
                label: 'Barbie',
                data: [8, 9, 8, 10, 6],
                backgroundColor: 'rgba(236, 72, 153, 0.2)',
                borderColor: 'rgba(236, 72, 153, 1)',
                borderWidth: 2
            }, {
                label: 'Super Mario Bros',
                data: [7, 4, 4, 7, 10],
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    pointLabels: { font: { size: 12 }, color: '#333' },
                    suggestedMin: 0,
                    suggestedMax: 10,
                    ticks: {
                        backdropColor: 'rgba(255, 255, 255, 0.75)',
                        stepSize: 2,
                        color: '#666'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#333'
                    }
                }
            }
        }
    });

    const analyzeBtn = document.getElementById('analyze-btn');
    const scriptInput = document.getElementById('script-input') as HTMLTextAreaElement;
    const theorySelect = document.getElementById('theory-select') as HTMLSelectElement;
    const aiOutput = document.getElementById('ai-output-content');
    const analyzeLoader = document.getElementById('analyze-loader');
    const analyzeText = document.getElementById('analyze-text');
    
    analyzeBtn.addEventListener('click', async () => {
        const script = scriptInput.value;
        if (!script) {
            aiOutput.innerHTML = '<p class="text-red-500 text-sm">Por favor, introduce un guion para analizar.</p>';
            return;
        }

        analyzeText.classList.add('hidden');
        analyzeLoader.classList.remove('hidden');
        analyzeBtn.setAttribute('disabled', 'true');
        aiOutput.innerHTML = '<p class="text-center text-gray-500 animate-pulse">Analizando tu guion con la aplicación experimental...</p>';
        
        const prompt = `Actúa como un analista experto en guiones de cine y películas de marca. Analiza el siguiente guion basándote en la teoría de ${theorySelect.options[theorySelect.selectedIndex].text}. Identifica los puntos clave de la teoría que están presentes o ausentes y proporciona recomendaciones específicas y accionables para mejorar el guion. Estructura tu respuesta con un encabezado principal, una sección de "Análisis" y una sección de "Recomendaciones". El guion es: \n\n${script}`;
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: "Actúa como un consultor de guion experto en películas de marca."
                }
            });
            
            const text = response.text;
            const htmlContent = typeof marked !== 'undefined' ? marked.parse(text) : text.replace(/\n/g, '<br>');
            
            aiOutput.innerHTML = `<h4 class="text-xl font-bold mb-4 text-gray-800">Análisis de la Aplicación Experimental del Profesor Miguelangel Tisera</h4><div class="prose max-w-none">${htmlContent}</div>`;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
            aiOutput.innerHTML = `<p class="text-red-500 text-sm">Error al conectar con la IA: ${errorMessage}. Por favor, inténtalo de nuevo.</p>`;
        } finally {
            analyzeText.classList.remove('hidden');
            analyzeLoader.classList.add('hidden');
            analyzeBtn.removeAttribute('disabled');
        }
    });
});
