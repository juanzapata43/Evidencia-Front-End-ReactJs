import Link from "next/link";

/**
 * Componente Dashboard que muestra una cuadrícula de tarjetas con enlaces.
 * Cada tarjeta contiene un título y un hipervínculo.
 *
 * @component
 * @example
 * return (
 *   <Dashboard />
 * )
 *
 * @returns {JSX.Element} El componente de dashboard renderizado.
 */
const Dashboard = () => {
  const cards = [
    { title: "Género", href: "/generos" },
    { title: "Media", href: "/medias" },
    { title: "Tipo", href: "/tipos" },
    { title: "Productora", href: "/productoras" },
    { title: "Director", href: "/directores" },
  ];

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
              Panel de inicio
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <Link
                  key={index}
                  href={card.href}
                  className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h2 className="text-xl font-semibold text-gray-800">
                    {card.title}
                  </h2>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Dashboard;
