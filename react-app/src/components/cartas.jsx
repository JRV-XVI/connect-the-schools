import React from 'react';

/**
 * Componente de tarjeta estadística reutilizable
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la tarjeta
 * @param {string|number} props.value - Valor numérico principal
 * @param {string} props.icon - Clase del ícono de Font Awesome (ej: "fa-school")
 * @param {string} props.color - Color de la tarjeta (primary, success, warning, danger)
 * @param {string} props.trend - Texto descriptivo de la tendencia
 * @param {boolean} props.isTrendPositive - Si la tendencia es positiva (true) o negativa (false)
 */
const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = "primary", 
  trend = "",
  isTrendPositive = true 
}) => {
  return (
<div className={`card border-start border-${color} border-4 shadow-sm h-100`}>
      <div className="card-body py-2">
        <div className="d-flex justify-content-between align-items-center">
          <div>
          <h6 className="text-muted mb-1">{title}</h6>
          <h3 className="mb-0 fw-bold">{value}</h3>
          </div>
          
          <div className={`stat-icon bg-${color}-light`}>
            <i className={`fas ${icon}`}></i>
          </div>
        </div>
        {trend && (
          <div className="mt-2">
            <span className={`text-${isTrendPositive ? 'success' : 'danger'} small`}>
              <i className={`fas fa-arrow-${isTrendPositive ? 'up' : 'down'} me-1`}></i>
              {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Componente contenedor para mostrar múltiples tarjetas estadísticas
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.cards - Array de objetos con datos para cada tarjeta
 */
const StatCardGroup = ({ cards }) => {
  return (
    <div className="row">
      {cards.map((card, index) => (
        <div key={index} className="col-xl-3 col-md-6 mb-4">
          <StatCard
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color || "primary"}
            trend={card.trend}
            isTrendPositive={card.isTrendPositive !== undefined ? card.isTrendPositive : true}
          />
        </div>
      ))}
    </div>
  );
};

export { StatCard, StatCardGroup };