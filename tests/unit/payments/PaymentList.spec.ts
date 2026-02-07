import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import PaymentList from "@/components/payments/PaymentList.vue";
import type { Payment } from "@/types/Payment";
import type { User } from "@/types/User";

/* Mock router */
const mockPush = jest.fn();
jest.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

//Include phone (now required in User type)
const mockUsers: User[] = [
  { id: 1, name: "Charitha", email: "charitha@mail.com", phone: "9876543210" },
  { id: 2, name: "Rahul", email: "rahul@mail.com", phone: "9123456780" },
];

const mockPayments: Payment[] = [
  {
    id: 1,
    userId: 1,
    amount: 500,
    status: "SUCCESS",
    category: "Subscription",
    date: "2026-01-10",
  },
  {
    id: 2,
    userId: 2,
    amount: 1200,
    status: "PENDING",
    category: "Shopping",
    date: "2026-02-02",
  },
];

describe("PaymentList.vue", () => {
  let store: any;

  beforeEach(() => {
    mockPush.mockClear();

    // Fresh store for each test
    store = createStore({
      state: {
        users: mockUsers,
        payments: mockPayments,
      },
    });
  });

  it("renders table rows correctly", () => {
    const wrapper = mount(PaymentList, {
      global: { plugins: [store] },
    });

    expect(wrapper.text()).toContain("Charitha");
    expect(wrapper.text()).toContain("Rahul");
    expect(wrapper.text()).toContain("500");
    expect(wrapper.text()).toContain("1200");

    expect(wrapper.find(".success").text()).toBe("SUCCESS");
    expect(wrapper.find(".pending").text()).toBe("PENDING");
  });

  it("filters payments by user name", async () => {
    const wrapper = mount(PaymentList, {
      global: { plugins: [store] },
    });

    await wrapper.find("input").setValue("Charitha");

    const rows = wrapper.findAll("tbody tr");
    expect(rows).toHaveLength(1);
    expect(wrapper.text()).toContain("Charitha");
    expect(wrapper.text()).not.toContain("Rahul");
  });

  it("filters payments by status", async () => {
    const wrapper = mount(PaymentList, {
      global: { plugins: [store] },
    });

    await wrapper.find("select").setValue("PENDING");

    const rows = wrapper.findAll("tbody tr");
    expect(rows).toHaveLength(1);
    expect(wrapper.text()).toContain("Rahul");
    expect(wrapper.text()).not.toContain("Charitha");
  });

  it("navigates to payment detail page on view button click", async () => {
    const wrapper = mount(PaymentList, {
      global: { plugins: [store] },
    });

    await wrapper.findAll(".view-btn")[0].trigger("click");

    expect(mockPush).toHaveBeenCalledWith("/payments/1");
  });

  it("navigates to add payment page on add button click", async () => {
    const wrapper = mount(PaymentList, {
      global: { plugins: [store] },
    });

    await wrapper.find(".add-btn").trigger("click");

    expect(mockPush).toHaveBeenCalledWith("/payments/new");
  });
});
