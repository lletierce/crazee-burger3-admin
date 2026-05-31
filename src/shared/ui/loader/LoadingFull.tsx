export default function LoadingFull() {
  return (
    <div className="min-h-screen flex justify-center items-center  gap-x-4  bg-[linear-gradient(#333,#292729)]">
      <h1 className="text-5xl font-amatic font-bold text-center text-[#f5f5f7]">Chargement...</h1>
      <Spinner />
    </div>
  )
}


export function Spinner() {
  return (
    <div className="w-10 h-10 border-4 border-orange-primary border-t-transparent rounded-full animate-spin" />
  );
}