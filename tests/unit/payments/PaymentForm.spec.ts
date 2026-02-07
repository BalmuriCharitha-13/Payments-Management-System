import { mount } from "@vue/test-utils";
import PaymentForm from "@/components/payments/PaymentForm.vue";
import { createStore } from "vuex";

/* Mock router navigation */
const mockPush = jest.fn();
jest.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ params: {} }),
}));

/* Prevent real alert popups during test */
window.alert = jest.fn();

describe("PaymentForm.vue (Vuex)", () => {
  let store: any;

  beforeEach(() => {
    mockPush.mockClear();
    (window.alert as jest.Mock).mockClear();

    store = createStore({
      state: {
        users: [
          { id: 1, name: "Charitha", email: "charitha@mail.com" },
          { id: 2, name: "Rahul", email: "rahul@mail.com" },
        ],
        payments: [],
      },
      mutations: {
        ADD_PAYMENT(state: any, payment: any) {
          state.payments.push(payment);
        },
      },
    });
  });

  it("renders form fields", () => {
    const wrapper = mount(PaymentForm, { global: { plugins: [store] } });
    expect(wrapper.find("select").exists()).toBe(true);
    expect(wrapper.find("input[type='number']").exists()).toBe(true);
  });

  it("blocks submit when fields invalid", async () => {
    const wrapper = mount(PaymentForm, { global: { plugins: [store] } });
    await wrapper.find("form").trigger("submit.prevent");

    expect(window.alert).toHaveBeenCalledWith(
      "Please fill all fields correctly"
    );
  });

  it("adds payment and redirects", async () => {
    const wrapper = mount(PaymentForm, { global: { plugins: [store] } });

    await wrapper.find("select").setValue(store.state.users[0].id);
    await wrapper.find("input[type='number']").setValue(500);

    await wrapper.find("form").trigger("submit.prevent");

    expect(store.state.payments.length).toBe(1);
    expect(store.state.payments[0].amount).toBe(500);
    expect(window.alert).toHaveBeenCalledWith("Payment added!");
    expect(mockPush).toHaveBeenCalledWith("/payments");
  });
});
