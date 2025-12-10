export default {
    namespaced: true,

    state: {
        reviews: JSON.parse(localStorage.getItem('reviews')) || []
    },
    mutations: {
        SET_REVIEWS(state, reviews) {
            state.reviews = reviews;
            localStorage.setItem("reviews", JSON.stringify(reviews));
        },
        ADD_REVIEWS(state, review) {
            state.reviews.push(review);
            localStorage.setItem("reviews", JSON.stringify(state.reviews));
        }
    },

    actions: {
        loadReviews({ commit, rootState }) {
            const employeeId = rootState.data.reviews || [];
            if (!JSON.parse(localStorage.getItem("reviews")).length) {
                commit("SET_REVIEWS", employeeId);
            }
        },
        addReview({ commit }, review) {
            commit("ADD_REVIEWS", review);
        }
    },

    getters: {
    allReviews: (state) => state.reviews,
    reviewsByEmployee: (state) => (id) => state.reviews.filter(r => r.employeeId === id)
  }
};
