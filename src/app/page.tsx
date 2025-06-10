'use client';

import 'moment-duration-format';

import { useState, useEffect } from 'react';
import moment from 'moment';
import Image from 'next/image';

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [timeString, setTimeString] = useState('');

  const photos = [
    '/photos/1.png',
    '/photos/2.png',
    '/photos/3.png',
    '/photos/4.png',
    '/photos/5.png'
  ];

  useEffect(() => {
    const startDate = new Date('2022-11-05T03:00:00.000Z');

    const updateTime = () => {
      const now = moment();
      const duration = moment.duration(now.diff(startDate));

      const anos = duration.years();
      const meses = duration.months();
      const dias = duration.days();
      const horas = duration.hours();
      const minutos = duration.minutes();
      const segundos = duration.seconds();

      const formatted = `${anos} anos, ${meses} meses, ${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos`;

      setTimeString(formatted + "...");
    }

    updateTime();
    
    const timeout = setTimeout(updateTime, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const nextPhoto = () => {
    setCurrentPhoto((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToPhoto = (index: number) => {
    setCurrentPhoto(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-red-200 relative overflow-hidden">
      {/* Corações caindo em animação */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-500 text-2xl heart-falling"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              fontSize: `${1 + Math.random() * 1.5}rem`
            }}
          >
            ♥
          </div>
        ))}
      </div>

      {!showContent ? (
        // Tela inicial com botão
        <div className="flex flex-col items-center justify-center h-screen">
          <button
            onClick={() => setShowContent(true)}
            className="group relative cursor-pointer px-12 py-6 bg-gradient-to-r from-pink-500 to-red-500 text-white text-2xl font-bold rounded-full shadow-2xl hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-110 active:scale-95"
          >
            <span className="mr-3">♥</span>
            Clique
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>
      ) : (
        // Conteúdo principal
        <div className="container mx-auto w-full h-full sm:pb-8">
          <div className="px-4 py-4 sm:py-8 space-y-4 sm:space-y-12 h-screen">
            {/* Player de Música */}
            <div className="flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm sm:text-2xl">♪</span>
                    </div>
                    <div className="flex flex-row gap-2 sm:flex-col sm:gap-0">
                      <h3 className="font-semibold text-gray-800">Nossa Música</h3>
                      <p className="text-gray-600">Ao te ver</p>
                    </div>
                  </div>

                  <audio controls>
                    <source src="/audio/ao te ver (cover) - Rafael Portugal.ogg" type="audio/ogg" />
                    Seu navegador não suporta áudio.
                  </audio>
                </div>
              </div>
            </div>

            {/* Slideshow de Fotos */}
            <div className="flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full">
                <div className="relative">
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 cursor-pointer text-xs transform -translate-y-1/2 bg-black/20 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    {'<--'}
                  </button>

                  <Image
                    src={photos[currentPhoto]}
                    alt={`Foto ${currentPhoto + 1}`}
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                    width={400}
                    height={400}
                  />

                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 cursor-pointer text-xs transform -translate-y-1/2 bg-black/20 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    {'-->'}
                  </button>
                
                </div>

                {/* Indicadores de posição */}
                <div className="flex justify-center mt-4 space-x-2">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPhoto(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentPhoto ? 'bg-pink-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Contador de Tempo */}
            <div className="flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 sm:p-8 shadow-2xl text-center max-w-2xl">
                <h2 className="text-lg sm:text-3xl font-bold text-pink-600 mb-2 sm:mb-4">
                  Eu te amo há:
                </h2>
                <p className="text-xs sm:text-xl text-gray-800 font-semibold">
                  {timeString}
                </p>
              </div>
            </div>

            <a href="#message" className="flex justify-center items-center">
              <span className="text-4xl">⬇️</span>
            </a>
          </div>
          <div id="message">
            {/* Mensagem Especial (aparece quando rola para baixo) */}
            <div className=" flex justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-2xl max-w-4xl text-center">
                <div className="space-y-6 text-lg text-gray-800 leading-relaxed">
                  <p>
                    Meu amor, cada dia ao seu lado é uma nova descoberta, uma nova razão para sorrir.
                    Você trouxe cor para minha vida de uma forma que eu nunca imaginei possível.
                  </p>
                  <p>
                    Desde o dia em que nos conhecemos, meu coração soube que você era especial.
                    Seus olhos, seu sorriso, sua forma única de ver o mundo... tudo em você me encanta.
                  </p>
                  <p>
                    Quero estar ao seu lado em todos os momentos - nos risos, nas lágrimas,
                    nas aventuras e nos momentos de paz. Você é meu presente, meu futuro, meu tudo.
                  </p>
                  <p className="text-2xl font-bold text-pink-600 mt-8">
                    Te amo infinitamente! ♥
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
