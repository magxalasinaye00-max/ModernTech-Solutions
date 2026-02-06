import api from "../../api";

export default {
    namespaced: true,

    state: {
        all: []
    },
    mutations: {
        SET_REVIEWS(state, reviews) {
            state.all = reviews;
        },
        ADD_REVIEW(state, review) {
            state.all.push(review);
        }
    },

    actions: {
        async fetchReviews({ commit }) {
            try {
                const res = await api.get("/performance-reviews");
                commit("SET_REVIEWS", res.data);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            }
        },
        async addReview({ commit }, review) {
            try {
                const res = await api.post("/performance-reviews", review);
                commit("ADD_REVIEW", res.data);
            } catch (err) {
                console.error("Failed to add review", err);
                throw err;
            }
        }
    },

    getters: {
        allReviews: (state) => state.all,
        reviewsByEmployee: (state) => (id) => state.all.filter(r => r.employee_id === id)
    }
};
