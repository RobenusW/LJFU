import NavBar from "../NavBar.tsx";

export default function HOW() {
  return (
    <div className="d-flex flex-column vh-100 position-relative">
      <NavBar />
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <h1>How It Works</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          malesuada, libero non fermentum varius, nunc metus tincidunt sapien,
          nec ultricies nunc purus nec nunc. In hac habitasse platea dictumst.
          Nullam auctor, purus nec suscipit venenatis, purus ex ultricies
          libero, nec fermentum risus felis nec libero. Nullam auctor, purus nec
          suscipit venenatis, purus ex ultricies libero, nec fermentum risus
          felis nec libero.
        </p>
      </div>
    </div>
  );
}
