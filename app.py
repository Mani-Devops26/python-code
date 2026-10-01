from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

rides = [
    {
        "id": 1,
        "name": "Thunder Wave",
        "description": "A high-speed water slide for thrill seekers.",
        "price": 499,
        "category": "Adventure"
    },
    {
        "id": 2,
        "name": "Aqua Tornado",
        "description": "Spin through a giant water tornado.",
        "price": 599,
        "category": "Thrill"
    },
    {
        "id": 3,
        "name": "Lazy River",
        "description": "Relax and float peacefully around the park.",
        "price": 299,
        "category": "Relax"
    },
    {
        "id": 4,
        "name": "Ocean Wave Pool",
        "description": "Enjoy an artificial beach experience.",
        "price": 399,
        "category": "Family"
    },
    {
        "id": 5,
        "name": "Kids Splash Zone",
        "description": "Safe and exciting water activities for kids.",
        "price": 199,
        "category": "Kids"
    }
]

bookings = []


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/rides", methods=["GET"])
def get_rides():
    return jsonify(rides)


@app.route("/api/bookings", methods=["GET"])
def get_bookings():
    return jsonify(bookings)


@app.route("/api/bookings", methods=["POST"])
def create_booking():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Invalid request"
        }), 400

    customer_name = data.get("customerName")
    email = data.get("email")
    phone = data.get("phone")
    ride_id = data.get("rideId")
    tickets = data.get("tickets", 1)

    if not customer_name or not email or not phone or not ride_id:
        return jsonify({
            "error": "All fields are required"
        }), 400

    try:
        tickets = int(tickets)

        if tickets <= 0:
            raise ValueError

    except ValueError:
        return jsonify({
            "error": "Tickets must be a positive number"
        }), 400

    selected_ride = next(
        (ride for ride in rides if ride["id"] == int(ride_id)),
        None
    )

    if not selected_ride:
        return jsonify({
            "error": "Ride not found"
        }), 404

    total_amount = selected_ride["price"] * tickets

    booking = {
        "id": len(bookings) + 1,
        "customerName": customer_name,
        "email": email,
        "phone": phone,
        "ride": selected_ride["name"],
        "tickets": tickets,
        "totalAmount": total_amount
    }

    bookings.append(booking)

    return jsonify({
        "message": "Booking successful",
        "booking": booking
    }), 201


@app.route("/health")
def health():

    return jsonify({
        "status": "UP",
        "application": "WaterPark",
        "version": "1.0"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
