'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useSnackbar } from '@/components/SnackbarProvider';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      showSnackbar({ message: 'Por favor completa todos los campos del formulario', variant: 'error' });
      return;
    }

    const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    if (!emailRegex.test(email)) {
      showSnackbar({ message: 'Ingresa un email válido', variant: 'error' });
      return;
    }

    setLoading(true);

    try {
      const to = 'contacto@aquasentinel.com';
      const subject = 'Nuevo mensaje de contacto - AquaSentinel';
      const body = `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`;

      const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      showSnackbar({
        message: 'Abriendo tu cliente de correo para enviar el mensaje',
        variant: 'success',
      });

      window.location.href = mailtoUrl;

      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error preparing mailto:', error);
      showSnackbar({ message: 'No se pudo iniciar el envío del mensaje', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-neutral-light/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-neutral-dark mb-4">
            Ponte en Contacto
          </h2>
          <p className="text-xl text-neutral-dark/70 max-w-3xl mx-auto">
            Combatiendo la contaminación por minería ilegal en Madre de Dios.
            Más de 180 toneladas de mercurio liberadas al año. AquaSentinel protege
            la salud pública y biodiversidad amazónica con monitoreo continuo 24/7.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-display text-neutral-dark mb-2">
                  Email
                </h3>
                <p className="text-neutral-dark/70">contacto@aquasentinel.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-display text-neutral-dark mb-2">
                  Teléfono
                </h3>
                <p className="text-neutral-dark/70">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-display text-neutral-dark mb-2">
                  Ubicación
                </h3>
                <p className="text-neutral-dark/70">
                  Puerto Maldonado, Madre de Dios
                  <br />
                  Perú - Amazonía
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral-dark mb-2"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-light focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-dark mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-light focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-neutral-dark mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-light focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:hover:scale-100 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02]"
              >
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
