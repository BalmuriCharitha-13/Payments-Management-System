import { mount } from "@vue/test-utils";
import PaymentDetail from "@/components/payments/PaymentDetail.vue";
import { createStore } from "vuex";

const mockRouterPush = jest.fn();
jest.mock("vue-router", () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useRoute: () => ({ params: { id: 1 } }),
}));

window.confirm = jest.fn(() => true);
window.alert = jest.fn();

describe("PaymentDetail.vue (Vuex)", () => {
  let store: any;

  beforeEach(() => {
    mockRouterPush.mockClear();

    store = createStore({
      state: {
        users: [
          { id: 1, name: "Charitha", email: "charitha@mail.com" },
          { id: 2, name: "Rahul", email: "rahul@mail.com" },
        ],
        payments: [
          {
            id: 1,
            userId: 1,
            amount: 500,
            status: "SUCCESS",
            category: "Subscription",
            date: "2026-01-10",
          },
        ],
      },
      getters: {
        getPaymentById: (state: any) => (id: number) =>
          state.payments.find((p: any) => p.id === id),
        getUserById: (state: any) => (id: number) =>
          state.users.find((u: any) => u.id === id),
      },
      mutations: {
        DELETE_PAYMENT(state: any, id: number) {
          state.payments = state.payments.filter((p: any) => p.id !== id);
        },
      },
    });
  });

  test("displays payment details correctly", () => {
    const wrapper = mount(PaymentDetail, {
      global: { plugins: [store] },
    });

    const payment = store.state.payments[0];
    const user = store.state.users.find((u: any) => u.id === payment.userId);

    // Checks if UI shows correct data from Vuex
    expect(wrapper.text()).toContain("Payment Details");
    expect(wrapper.text()).toContain(`#${payment.id}`);
    expect(wrapper.text()).toContain(user?.name || "");
    expect(wrapper.text()).toContain(payment.amount.toString());
    expect(wrapper.text()).toContain(payment.status);
    expect(wrapper.text()).toContain(payment.category);
  });

  test("back button navigates to payments list", async () => {
    const wrapper = mount(PaymentDetail, { global: { plugins: [store] } });

    await wrapper.find(".back-btn").trigger("click");
    expect(mockRouterPush).toHaveBeenCalledWith("/payments");
  });

  test("delete button removes payment and redirects", async () => {
    const wrapper = mount(PaymentDetail, { global: { plugins: [store] } });

    const initialLength = store.state.payments.length;

    await wrapper.find(".delete-btn").trigger("click");

    expect(window.confirm).toHaveBeenCalled();
    expect(store.state.payments.length).toBe(initialLength - 1);
    expect(mockRouterPush).toHaveBeenCalledWith("/payments");
  });
});
