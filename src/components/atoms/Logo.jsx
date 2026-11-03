import logo from "../../assets/boon-edam-logo.png";

export default function Logo({ className = "brand-logo" }) {
  return <img className={className} src={logo} alt="Boon Edam" />;
}
