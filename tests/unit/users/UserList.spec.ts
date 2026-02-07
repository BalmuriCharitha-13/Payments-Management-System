import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import UserList from "@/components/users/UserList.vue";
import type { User } from "@/types/User";

const mockPush = jest.fn();
jest.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("UserList.vue", () => {
  let store: any;

  beforeEach(() => {
    mockPush.mockClear();

    store = createStore({
      state: {
        users: [
          { id: 1, name: "Charitha", email: "charitha@mail.com", phone: "9876543210" },
          { id: 2, name: "Rahul", email: "rahul@mail.com", phone: "9123456789" },
        ] as User[],
      },
    });
  });

  it("renders user table correctly", () => {
    const wrapper = mount(UserList, {
      global: { plugins: [store] },
    });

    expect(wrapper.find("table").exists()).toBe(true);
    expect(wrapper.findAll("tbody tr")).toHaveLength(2);

    expect(wrapper.text()).toContain("Charitha");
    expect(wrapper.text()).toContain("Rahul");

    // 🔥 New checks
    expect(wrapper.text()).toContain("9876543210");
    expect(wrapper.text()).toContain("9123456789");
  });

  it("filters users based on search input", async () => {
    const wrapper = mount(UserList, {
      global: { plugins: [store] },
    });

    await wrapper.find("input").setValue("Rahul");

    expect(wrapper.findAll("tbody tr")).toHaveLength(1);
    expect(wrapper.text()).toContain("Rahul");
    expect(wrapper.text()).not.toContain("Charitha");
  });

  it("navigates to add user page when add button is clicked", async () => {
    const wrapper = mount(UserList, {
      global: { plugins: [store] },
    });

    await wrapper.find(".add-btn").trigger("click");

    expect(mockPush).toHaveBeenCalledWith("/users/new");
  });
});
