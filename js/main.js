document.getElementById('loan-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    // Obtener valores del formulario
    const amount = parseFloat(document.getElementById('amount').value);
    const annualInterestRate = parseFloat(document.getElementById('interest').value) / 100; // Tasa de interés anual en formato decimal
    const monthlyInterestRate = annualInterestRate / 12; // Convertir tasa anual a mensual
    const numberOfPayments = parseInt(document.getElementById('years').value); // Cantidad de cuotas (meses)

    // Verificar si el monto del préstamo es mayor a 10000
    if (amount > 10000) {
        // Calcular pagos mensuales
        const monthlyPayment = calculateMonthlyPayment(amount, monthlyInterestRate, numberOfPayments);

        // Mostrar resultados
        if (isFinite(monthlyPayment)) {
            const totalPayment = monthlyPayment * numberOfPayments;
            const totalInterest = totalPayment - amount;
            document.getElementById('monthly-payment').textContent = monthlyPayment.toFixed(2);
            document.getElementById('total-payment').textContent = totalPayment.toFixed(2);
            document.getElementById('total-interest').textContent = totalInterest.toFixed(2);

            // Mostrar pagos mensuales en consola
            showMonthlyPayments(monthlyPayment, numberOfPayments);
        } else {
            alert('Por favor, revisa los valores ingresados');
        }
    } else {
        alert('El monto del préstamo debe ser mayor a 10000.');
    }
});

// Función para calcular el pago mensual
function calculateMonthlyPayment(amount, monthlyInterestRate, numberOfPayments) {
    if (monthlyInterestRate === 0) {
        return amount / numberOfPayments;
    }
    const x = Math.pow(1 + monthlyInterestRate, numberOfPayments);
    return (amount * monthlyInterestRate * x) / (x - 1);
}

// Función para mostrar los pagos mensuales en consola
function showMonthlyPayments(monthlyPayment, numberOfPayments) {
    console.log("Pagos mensuales:");
    for (let i = 1; i <= numberOfPayments; i++) {
        console.log(`Pago mensual para el mes ${i}: ${monthlyPayment.toFixed(2)}`);
    }
} 
class Prestamo {
    constructor(id, monto, plazo) {
        this.id = id;
        this.monto = monto;
        this.tasaInteres = 23; // Tasa de interés fija del 23%
        this.plazo = plazo;
    }

    calcularCuotaMensual() {
        let tasaMensual = this.tasaInteres / 12 / 100;
        let cuota = this.monto * tasaMensual / (1 - Math.pow(1 + tasaMensual, -this.plazo));
        return cuota.toFixed(2);
    }
}

let prestamos = [
    new Prestamo(1, 12000, 2),
    new Prestamo(2, 20000, 12),
    new Prestamo(3, 15000, 6),
    new Prestamo(4, 25000, 12),
];

function buscarPrestamoPorId(id) {
    return prestamos.find(prestamo => prestamo.id === id);
}

function filtrarPrestamosPorMonto(min, max) {
    return prestamos.filter(prestamo => prestamo.monto >= min && prestamo.monto <= max);
}

// Buscar un préstamo por ID
let prestamoBuscado = buscarPrestamoPorId(2);
console.log(prestamoBuscado);

// Filtrar préstamos por monto
let prestamosFiltrados = filtrarPrestamosPorMonto(12000, 25000);
console.log(prestamosFiltrados);

// Calcular la cuota mensual de un préstamo específico
if (prestamoBuscado) {
    console.log(`Cuota mensual: $${prestamoBuscado.calcularCuotaMensual()}`);
}