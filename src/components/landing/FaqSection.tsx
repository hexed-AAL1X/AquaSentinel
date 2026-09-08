const faqs = [
  {
    q: '¿Qué es AquaSentinel?',
    a: 'AquaSentinel es un sistema de monitoreo ambiental para vigilar la calidad del agua y detectar mercurio en ríos de Madre de Dios, en la Amazonía peruana.',
  },
  {
    q: '¿Por qué es importante monitorear el mercurio en los ríos?',
    a: 'La minería ilegal libera mercurio que contamina ríos y afecta la salud de comunidades amazónicas. El monitoreo continuo permite alertar a tiempo y tomar decisiones con datos reales.',
  },
  {
    q: '¿Dónde funciona el sistema?',
    a: 'Opera en Puerto Maldonado y la cuenca de Madre de Dios, con sensores en ríos como Madre de Dios y Tambopata.',
  },
  {
    q: '¿Qué datos entrega AquaSentinel?',
    a: 'Entrega mediciones de mercurio, pH, temperatura, turbidez y alertas cuando los valores salen de rangos seguros para la salud pública y el ecosistema.',
  },
];

/** Contenido estático orientado a SEO / featured snippets */
export default function FaqSection() {
  return (
    <section id="faq" className="py-20 bg-white" aria-labelledby="faq-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold font-display text-neutral-dark mb-4 text-center">
          Preguntas frecuentes sobre monitoreo de ríos
        </h2>
        <p className="text-lg text-neutral-dark/80 text-center mb-12 max-w-2xl mx-auto">
          Respuestas claras sobre vigilancia de mercurio, calidad del agua y protección ambiental en Madre de Dios.
        </p>
        <div className="space-y-6">
          {faqs.map((item) => (
            <article key={item.q} className="border-b border-neutral-light pb-6">
              <h3 className="text-xl font-semibold font-display text-neutral-dark mb-2">{item.q}</h3>
              <p className="text-neutral-dark/80 leading-relaxed">{item.a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
