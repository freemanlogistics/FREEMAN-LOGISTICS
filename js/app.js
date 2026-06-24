async function trackShipment() {

    const trackingInput = document.getElementById('trackingInput').value.trim();
    const trackingResult = document.getElementById('trackingResult');

    if (!trackingInput) {
        trackingResult.innerHTML = 
        <div class="result-card">
            <h4>Enter Tracking ID</h4>
            <p>Please type your tracking number</p>
        </div>;
        return;
    }

    trackingResult.innerHTML = 
    <div class="result-card">
        <h4>Tracking...</h4>
        <p>Please wait...</p>
    </div>;

    try {
        const res = await fetch(
            /.netlify/functions/track?tracking=${encodeURIComponent(trackingInput)}
        );

        const data = await res.json();

        if (!res.ok || !data || data.error) {
            trackingResult.innerHTML = 
            <div class="result-card">
                <h4>No Shipment Found</h4>
                <p>Please check your tracking ID</p>
            </div>;
            return;
        }

        trackingResult.innerHTML = 
        <div class="result-card">
            <h4>Shipment Found</h4>
            <p><strong>Tracking ID:</strong> ${data.tracking_number}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Current Location:</strong> ${data.current_location}</p>
            <p><strong>From:</strong> ${data.origin}</p>
            <p><strong>To:</strong> ${data.destination}</p>
            <p><strong>Estimated Delivery:</strong> ${data.estimated_delivery}</p>
        </div>
        ;

    } catch (err) {
        trackingResult.innerHTML = 
        <div class="result-card">
            <h4>Error</h4>
            <p>Unable to fetch tracking info</p>
        </div>;
    }
}

document.getElementById("bookingForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = {
        sender_name: e.target.sender_name.value,
        receiver_name: e.target.receiver_name.value,
        email: e.target.email.value,
        origin: e.target.origin.value,
        destination: e.target.destination.value,
        shipment_type: e.target.shipment_type.value,
        shipment_details: e.target.shipment_details.value,
        status: "Pending",
        current_location: e.target.origin.value,
        estimated_delivery: e.target.estimated_delivery.value
    };

    const submitBtn = e.target.querySelector("button");
    submitBtn.innerText = "Booking...";
    submitBtn.disabled = true;
    
    const res = await fetch("/.netlify/functions/create-shipment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const result = await res.json();

    if (res.ok) {
        
        alert("Shipment booked successfully! Tracking ID: " + result.tracking_number);
        e.target.reset();
        submitBtn.innerText = "Book Shipment";
        submitBtn.disabled = false;
    } else {
        alert("Error booking shipment");
    }
});

 document.addEventListener("keydown", function(e) {
    const key = e.key.toLowerCase();

    if (e.ctrlKey && e.shiftKey && key === "a") {
        e.preventDefault();
        window.location.href = "/admin.html";
    }
});
