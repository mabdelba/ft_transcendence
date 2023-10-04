import SimpleButton from '../buttons/simpleButton';

function NewGame() {
  return (
    <div className="h-full w-full NeonShadowBord flex flex-col ">
      <div className="w-full h-[50%]  flex justify-center items-center text-base xl:text-2xl">
        Ready for a new challenge!
      </div>
      <div className="w-full h-[50%]  flex justify-center items-start">
        <div className="w-1/2 h-[50%]">
          <SimpleButton content="New game" buttonType="button" />
        </div>
      </div>
    </div>
  );
}

export default NewGame;
