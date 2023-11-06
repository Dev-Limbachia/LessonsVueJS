var defaultSubjects = [
  {
    id: 1,
    title: "Math",
    location: "London",
    price: 500,
    image: "/image/math_icon.png",
    availableInventory: 5,
  },

  {
    id: 2,
    title: "English",
    location: "Manchester",
    price: 200,
    image: "/image/english_icon.png",
    availableInventory: 5,
  },

  {
    id: 3,
    title: "Geography",
    location: "Oxford",
    price: 250,
    image: "/image/geography_icon.png",
    availableInventory: 5,
  },

  {
    id: 4,
    title: "Chemistry",
    location: "Cambridge",
    price: 300,
    image: "/image/science_icon.png",
    availableInventory: 5,
  },

  {
    id: 5,
    title: "Computer",
    location: "Brighton",
    price: 800,
    image: "/image/computer_icon.png",
    availableInventory: 5,
  },

  {
    id: 6,
    title: "Drawing",
    location: "Liverpool",
    price: 450,
    image: "/image/drawing_icon.png",
    availableInventory: 5,
  },

  {
    id: 7,
    title: "Music",
    location: "Manchester",
    price: 750,
    image: "/image/music_icon.png",
    availableInventory: 5,
  },

  {
    id: 8,
    title: "Physics",
    location: "Birmingham",
    price: 450,
    image: "/image/physics_icon.png",
    availableInventory: 5,
  },

  {
    id: 9,
    title: "Biology",
    location: "Cardiff",
    price: 400,
    image: "/image/biology_icon.png",
    availableInventory: 5,
  },

  {
    id: 10,
    title: "Drama",
    location: "Bristol",
    price: 550,
    image: "/image/drama_icon.png",
    availableInventory: 5,
  },
];

// import jsonData from './data.json';
// const defaultSubjects = jsonData;

new Vue({
  el: "#app",
  data: {
    sitename: "After School Club",
    showProduct: true,
    subjects: [...defaultSubjects],
    cart: [], // array to store items in shopping cart
    sortPrice: "Price", // Default sorting type - price
    sortTitle: "Title", // Default sorting type - title
    sortLocation: "Location", // Default sorting type - location
    sortAvailability: "Availability", // Default sorting type - availability
    searchText: "", // User's search input
    sortCategory: null, // Default selection
    sortOrder: null, // Default selection
    confirmationText: "", // Message to display after checkout
    orderSubmitted: false, // Flag to indicate if the order has been submitted
    name: "", // Validation for checkout
    phone: "", // Validation for checkout
    isCheckoutEnabled: false, // Validation for checkout
  },
  methods: {
    addToCart: function (subject, index) {
      let itemIndex = this.cart.findIndex((ct) => ct.id === subject.id);
      if (itemIndex == -1) {
        this.cart.push({
          ...subject,
          quantity: 1,
        });
      } else {
        this.cart[itemIndex].quantity++;
      }
      this.subjects[index].availableInventory--;
    },

    // Function to handle sorting based on the selected category and order
    sortSubject: function () {
      if (this.sortCategory && this.sortOrder) {
        if (this.sortCategory === "Title") {
          // Sort subjects by title
          this.subjects.sort((a, b) => {
            if (this.sortOrder === "ascending") {
              return a.title.localeCompare(b.title);
            } else {
              return b.title.localeCompare(a.title);
            }
          });
        } else if (this.sortCategory === "Location") {
          // Sort subjects by location
          this.subjects.sort((a, b) => {
            if (this.sortOrder === "ascending") {
              return a.location.localeCompare(b.location);
            } else {
              return b.location.localeCompare(a.location);
            }
          });
        } else if (this.sortCategory === "Availability") {
          // Sort subjects by availability
          if (this.sortOrder === "ascending") {
            this.subjects.sort(
              (a, b) => a.availableInventory - b.availableInventory
            );
          } else {
            this.subjects.sort(
              (a, b) => b.availableInventory - a.availableInventory
            );
          }
        } else if (this.sortCategory === "Price") {
          // Sort subjects by price
          if (this.sortOrder === "ascending") {
            this.subjects.sort((a, b) => a.price - b.price);
          } else {
            this.subjects.sort((a, b) => b.price - a.price);
          }
        }
      }
    },

    showCart() {
      if (this.cartItemCount == 0) {
        this.showProduct = true;
      } else {
        this.showProduct = this.showProduct ? false : true;
      }
    },

    resetShowProduct() {
      // Reset the subjects to the default order when "Availability" is selected
      this.subjects = [...defaultSubjects];
      this.sortCategory = null;
      this.sortOrder = null;
    },

    removeCartItem: function (item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        // Remove the item from the cart when the quantity reaches zero
        this.cart.splice(this.cart.indexOf(item), 1);
      }

      // Find the subject in the subjects array and increase its availability
      const subjectIndex = this.subjects.findIndex(
        (subject) => subject.id === item.id
      );
      if (subjectIndex !== -1) {
        this.subjects[subjectIndex].availableInventory++;
      }
    },

  // Function to handle the checkout process
  checkout() {
    if (this.isCheckoutEnabled) {
        // Display an alert message
        alert("The order is submitted.");

        // Reset the form and cart
        this.name = "";
        this.phone = "";
        this.cart = [];
        this.isCheckoutEnabled = false;

        // Reload the page
        location.reload();
    }
},
  },

  computed: {
    cartItemCount: function () {
      let totalCount = 0;

      for (const item of this.cart) {
        totalCount += item.quantity;
      }

      return totalCount || "";
    },

    canAddToCart: function () {
      return function (subject) {
        return subject.availableInventory > 0;
      };
    },

    // Search by Title and Location
    filteredSubjects: function () {
      if (!this.searchText) {
        // If the search input is empty, show all subjects
        return this.subjects;
      }

      const search = this.searchText.toLowerCase();
      return this.subjects.filter((subject) => {
        const title = subject.title.toLowerCase();
        const location = subject.location.toLowerCase();

        return title.startsWith(search) || location.startsWith(search);
      });
    },

        //Function to check checkout validation
        checkInputs() {
          // const namePattern = /^[a-zA-Z]+$/;
          const namePattern = /^[a-zA-Z\s]+$/;
          const phonePattern = /^[0-9]+$/;
          const isNameValid = namePattern.test(this.name);
          const isPhoneValid = phonePattern.test(this.phone) && this.phone.length >= 7;
          // Check if the cart is not empty
          this.isCartNotEmpty = this.cart.length > 0;
          this.isCheckoutEnabled = isNameValid && isPhoneValid && this.isCartNotEmpty;
      },
  },
});
