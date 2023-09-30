import Achievement from "../shapes/Achievement";
import Image from "next/image";
import NoAchiev from "../../../public/noAchiev.svg";



function LatestAchiev(){

	const numberOfAchievements = 5;
	var limiter = numberOfAchievements;
	if(limiter > 6)
		limiter = 6;
	const divArray = Array.from({ length: limiter }, (_, index) => index + 1);
	return(
		<div className="h-full w-full flex flex-col NeonShadowBord">
			<div className="w-full h-1/4 flex justify-start pl-10 items-center text-base lg:text-3xl">
				Latest achievements
			</div>
			{
				(limiter == 0) ?
				<div className="w-full h-1/2 flex flex-col text-2xl justify-center items-center">
					<Image  src={NoAchiev} alt="" />
					No achievements
				</div>
				:
				<div className="w-full h-3/4 px-5 md:px-10 pb-10 grid grid-rows-3 grid-cols-2 md:grid-rows-2 md:grid-cols-3 gap-4">
					{
						divArray.map((divNumber) => (
							<div>
								<Achievement color={true} number={divNumber}/>
							</div>
						))
					}
				</div>
			}

		</div>
	);
}

export default LatestAchiev;