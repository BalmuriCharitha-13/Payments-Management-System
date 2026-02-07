import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import UserForm from "@/components/users/UserForm.vue";
import type { User } from "@/types/User";

const mockPush = jest.fn();
jest.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("UserForm.vue", () => {
  let store: any;
  let addUserMock: jest.Mock;

  beforeEach(() => {
    mockPush.mockClear();
    addUserMock = jest.fn();

    store = createStore({
      state: {
        users: [
          { id: 1, name: "Charitha", email: "charitha@mail.com", phone: "9876543210" },
        ] as User[],
      },
      mutations: {
        ADD_USER: addUserMock,
      },
    });

    window.alert = jest.fn();
  });

  it("renders form fields correctly", () => {
    const wrapper = mount(UserForm, {
      global: { plugins: [store] },
    });

    expect(wrapper.find("input[type='text']").exists()).toBe(true);
    expect(wrapper.find("input[type='email']").exists()).toBe(true);
    expect(wrapper.find("input[type='tel']").exists()).toBe(true); // phone
    expect(wrapper.find("button[type='submit']").exists()).toBe(true);
  });

  it("shows alert when fields are empty", async () => {
    const wrapper = mount(UserForm, {
      global: { plugins: [store] },
    });

    await wrapper.find("form").trigger("submit.prevent");

    expect(window.alert).toHaveBeenCalledWith("Please fill all fields");
    expect(addUserMock).not.toHaveBeenCalled();
  });

  it("blocks duplicate email", async () => {
    const wrapper = mount(UserForm, {
      global: { plugins: [store] },
    });

    await wrapper.find("input[type='text']").setValue("Someone");
    await wrapper.find("input[type='email']").setValue("charitha@mail.com");
    await wrapper.find("input[type='tel']").setValue("9999999999"); // phone added

    await wrapper.find("form").trigger("submit.prevent");

    expect(window.alert).toHaveBeenCalledWith("User already exists");
    expect(addUserMock).not.toHaveBeenCalled();
  });

  it("calls ADD_USER mutation and navigates on valid submit", async () => {
    const wrapper = mount(UserForm, {
      global: { plugins: [store] },
    });

    await wrapper.find("input[type='text']").setValue("Rahul");
    await wrapper.find("input[type='email']").setValue("rahul@mail.com");
    await wrapper.find("input[type='tel']").setValue("9123456789"); // phone added

    await wrapper.find("form").trigger("submit.prevent");

    expect(addUserMock).toHaveBeenCalledWith(expect.any(Object), {
      id: 2,
      name: "Rahul",
      email: "rahul@mail.com",
      phone: "9123456789",
    });

    expect(window.alert).toHaveBeenCalledWith("User added successfully!");
    expect(mockPush).toHaveBeenCalledWith("/users");
  });
});
