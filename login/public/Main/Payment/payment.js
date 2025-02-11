document.getElementById('checkoutBtn').addEventListener('click', function (event) {
    event.preventDefault();

    // Get form fields
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zipCode = document.getElementById('pinCode').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expDate = document.getElementById('expDate').value;
    const cvv = document.getElementById('cvv').value;

    // Validate form fields
    if (fullName && email && address && city && state && zipCode && cardNumber.length === 19 && expDate && cvv) {
        // Show success message
        document.getElementById('successMessage').style.display = 'block';

        // Generate and download PDF receipt using jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add styles to the PDF
        doc.setFontSize(22);
        doc.setTextColor(40, 116, 240); // Blue header color
        doc.text('Payment Receipt', 105, 20, { align: 'center' }); // Centered text

        doc.setFontSize(16);
        doc.setTextColor(0); // Black text
        doc.text('---------------------------', 105, 30, { align: 'center' });

        // Setting a larger font for Full Name and aligning it to the left
        doc.setFontSize(14);
        doc.setFont('times', 'bold');
        doc.text(`Full Name: ${fullName}`, 10, 50);

        doc.setFont('normal'); // Back to normal font
        doc.text(`Email: ${email}`, 10, 60);
        doc.text(`Address: ${address}, ${city}, ${state} - ${zipCode}`, 10, 70);

        // Formatting card number to hide some digits
        doc.text(`Card Number: **** **** **** ${cardNumber.slice(-4)}`, 10, 80);
        doc.text(`Expiry Date: ${expDate}`, 10, 90);

        // Add a custom footer or message
        doc.setFontSize(10);
        doc.setTextColor(100); // Gray color
        doc.text('Thank you for your payment!', 105, 130, { align: 'center' });

        // Create a download link
        const downloadLink = document.getElementById('downloadReceipt');
        downloadLink.href = doc.output('bloburl');
        downloadLink.download = 'Payment_Receipt.pdf';

    } else {
        alert('Please fill in all the required fields correctly.');
    }
});


// Automatically add a space after every 4 digits in the credit card number input
document.getElementById('cardNumber').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\s+/g, ''); // Remove all spaces
    if (value.length > 16) value = value.slice(0, 16); // Ensure it's no longer than 16 digits
    // Add space after every 4 digits
    let formattedValue = value.replace(/(.{4})/g, '$1 ');
    e.target.value = formattedValue.trim(); // Update the input field with the formatted value
});

function redirecthome() {
    window.location.href = '../index_main.html';
}