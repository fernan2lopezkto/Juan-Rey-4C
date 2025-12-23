
import Slider from "@/components/Slider"
import PrincipalHero from "@/components/PrincipalHero";
import FilterButton from "@/components/FilterButton";
import PrincipalFooter from "@/components/PrincipalFooter";

export default function Home() {
  return (
    
    <div className="p-4">
      <PrincipalHero />
      <FilterButton />
      <Slider />
      <PrincipalFooter />
    </div>

  );
}
