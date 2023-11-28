// eslint-disable-next-line react/prop-types
export default function Avatar({username,userId}){
    const colors=['bg-red-200','bg-green-200','bg-purple','bg-blue-200','bg-yellow-200','bg-teal-200'];
    const userIdBase10=parseInt(userId,13);
    const colorIndex=userIdBase10%colors.length;
    const color=colors[colorIndex];
    return(
       <div className={"w-8 h-8 rounded-full  flex ietms-center " + color}>
        <div className="text-center w-full opacity-70">
        {username[0]}
        </div>
       </div>
    )
}