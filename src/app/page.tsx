
import Slider from "@/components/Slider"
import PrincipalHero from "@/components/PrincipalHero";
import FilterButton from "@/components/FilterButton";
import PrincipalFooter from "@/components/PrincipalFooter";

export default function Home() {
  return (
    
    <div>
      <PrincipalHero />
      <FilterButton />
      <div className="px-6">
        <Slider />
      </div>
      <div>
        <PrincipalFooter />
      </div>
      
    </div>

  );
}
