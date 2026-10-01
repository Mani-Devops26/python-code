const ridesContainer =
    document.getElementById("ridesContainer");

const rideSelect =
    document.getElementById("rideId");


// Ride icons

const icons = {
    Adventure: "🌊",
    Thrill: "🌪️",
    Relax: "🏝️",
    Family: "👨‍👩‍👧‍👦",
    Kids: "🧒"
};


// Load rides

fetch("/api/rides")

    .then(response => response.json())

    .then(rides => {

        rides.forEach(ride => {

            const card =
                document.createElement("div");

            card.className = "ride-card";

            card.innerHTML = `

                <div class="ride-icon">
                    ${icons[ride.category] || "🌊"}
                </div>

                <h3>
                    ${ride.name}
                </h3>

                <p>
                    ${ride.description}
                </p>

                <span class="category">
                    ${ride.category}
                </span>

                <div class="price">
                    ₹${ride.price}
                </div>

            `;

            ridesContainer.appendChild(card);


            // Add option to booking dropdown

            const option =
                document.createElement("option");

            option.value = ride.id;

            option.textContent =
                `${ride.name} - ₹${ride.price}`;

            rideSelect.appendChild(option);

        });

    })

    .catch(error => {

        console.error(
            "Unable to load rides:",
            error
        );

    });


// BOOKING

document
    .getElementById("bookingForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const booking = {

                customerName:
                    document
                        .getElementById(
                            "customerName"
                        )
                        .value,

                email:
                    document
                        .getElementById("email")
                        .value,

                phone:
                    document
                        .getElementById("phone")
                        .value,

                rideId:
                    document
                        .getElementById("rideId")
                        .value,

                tickets:
                    document
                        .getElementById("tickets")
                        .value
            };


            fetch(
                "/api/bookings",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(booking)

                }
            )

            .then(response => response.json())

            .then(data => {

                const result =
                    document.getElementById(
                        "bookingResult"
                    );


                if (data.error) {

                    result.innerHTML =
                        `❌ ${data.error}`;

                    return;
                }


                const booking =
                    data.booking;


                result.innerHTML = `

                    🎉 Booking Confirmed!

                    <br><br>

                    Booking ID:
                    <strong>
                        ${booking.id}
                    </strong>

                    <br>

                    Ride:
                    ${booking.ride}

                    <br>

                    Tickets:
                    ${booking.tickets}

                    <br>

                    Total:
                    ₹${booking.totalAmount}

                `;


                document
                    .getElementById("bookingForm")
                    .reset();

            })

            .catch(error => {

                console.error(error);

                document
                    .getElementById(
                        "bookingResult"
                    )
                    .innerHTML =
                    "❌ Something went wrong.";

            });

        }
    );
