import { fireEvent, render, screen } from "@testing-library/react";

import ULThemeCountryCodePicker from "@/components/ULThemeCountryCodePicker";

describe("ULThemeCountryCodePicker Component", () => {
  const mockCountry = {
    name: "Algeria",
    code: "DZ",
    dialCode: "213",
    flag: "🇩🇿",
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  // Snapshot Tests
  it("matches snapshot with placeholder (no country selected)", () => {
    const { container } = render(
      <ULThemeCountryCodePicker
        placeholder="Select Country"
        onClick={mockOnClick}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot with selected country", () => {
    const { container } = render(
      <ULThemeCountryCodePicker
        selectedCountry={mockCountry}
        onClick={mockOnClick}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot with fullWidth prop", () => {
    const { container } = render(
      <ULThemeCountryCodePicker
        selectedCountry={mockCountry}
        onClick={mockOnClick}
        fullWidth
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot in loading state", () => {
    const { container } = render(
      <ULThemeCountryCodePicker
        selectedCountry={mockCountry}
        onClick={mockOnClick}
        isLoading
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  // Rendering Tests
  it("renders placeholder when no country is selected", () => {
    render(
      <ULThemeCountryCodePicker
        placeholder="Select Country"
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("Select Country")).toBeInTheDocument();
  });

  it("renders selected country information", () => {
    render(
      <ULThemeCountryCodePicker
        selectedCountry={mockCountry}
        onClick={mockOnClick}
      />
    );

    const countrySpan = screen.getByText((_: string, element: Element | null) => {
      return (
        element?.tagName === "SPAN" &&
        element?.textContent === "Algeria, DZ, 213" &&
        element?.className.includes("truncate")
      );
    });
    expect(countrySpan).toBeInTheDocument();
    expect(screen.getByText("🇩🇿")).toBeInTheDocument();
  });

  it("renders chevron icon", () => {
    const { container } = render(
      <ULThemeCountryCodePicker
        selectedCountry={mockCountry}
        onClick={mockOnClick}
      />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  // Interaction Tests
  it("calls onClick when button is clicked", () => {
    render(
      <ULThemeCountryCodePicker
        selectedCountry={mockCountry}
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when isLoading is true", () => {
    render(
      <ULThemeCountryCodePicker
        selectedCountry={mockCountry}
        onClick={mockOnClick}
        isLoading
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  // Theme Classes Tests
  it("applies theme classes correctly", () => {
    render(
      <ULThemeCountryCodePicker
        selectedCountry={mockCountry}
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("theme-universal:bg-input-bg");
    expect(button).toHaveClass("theme-universal:text-input-text");
    expect(button).toHaveClass("theme-universal:border-input-border");
    expect(button).toHaveClass("theme-universal:rounded-input");
  });

  it("applies fullWidth styling when fullWidth is true", () => {
    render(
      <ULThemeCountryCodePicker
        selectedCountry={mockCountry}
        onClick={mockOnClick}
        fullWidth
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full");
  });
});
