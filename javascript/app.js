new Vue({
  el: "#app",
  data: {
    sitename: "After School Club",
    showProduct: true, // default
    subjects: [...defaultSubjects], // JSON data stored in an array
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
    // method to add subjects to cart
    addToCart: function (subject) {
      let itemIndex = this.cart.findIndex((ct) => ct.id === subject.id);
      if (itemIndex === -1) {
        this.cart.push({
          ...subject,
          quantity: 1,
        });
      } else {
        this.cart[itemIndex].quantity++;
      }

      // Finds the subject in the subjects array (not filteredSubjects) and update its availability
      const subjectIndex = this.subjects.findIndex((s) => s.id === subject.id);
      if (subjectIndex !== -1) {
        this.subjects[subjectIndex].availableInventory--;
      }
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

    // Method to show Cart page 
    showCart() {
      if (this.cartItemCount == 0) {
        this.showProduct = true;
      } else {
        this.showProduct = this.showProduct ? false : true;
      }
    },

    // Resets the sort filter to default (Relevance button)
    resetShowProduct() {
      // Reset the subjects to the default order when "Availability" is selected
      this.subjects = [...defaultSubjects];
      this.sortCategory = null;
      this.sortOrder = null;
    },

    // Remove Cart items
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

    // Counter for cart item
    cartItemCount: function () {
      let totalCount = 0;

      for (const item of this.cart) {
        totalCount += item.quantity;
      }

      return totalCount || "";
    },

    // Function to disable Cart button if no item is added to the cart
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

    //Function for checkout validation
    checkInputs() {
      // const namePattern = /^[a-zA-Z]+$/;
      const namePattern = /^[a-zA-Z\s]+$/;
      const phonePattern = /^[0-9]+$/;
      const isNameValid = namePattern.test(this.name);
      const isPhoneValid =
        phonePattern.test(this.phone) &&
        this.phone.length >= 7 &&
        this.phone.length <= 15;
      // Check if the cart is not empty
      this.isCartNotEmpty = this.cart.length > 0;
      this.isCheckoutEnabled =
        isNameValid && isPhoneValid && this.isCartNotEmpty;
    },
  },
});
