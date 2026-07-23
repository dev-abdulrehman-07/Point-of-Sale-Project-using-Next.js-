import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
export async function POST(req : Request) {
    try {

        const cookie = await cookies();
       const removeCookie = cookie.delete("velvetTokken")



        
  
 if(removeCookie){
    return NextResponse.json({
status : true
        })
    }else{
        return NextResponse.json({
    status : true
            })

    }


    } catch (error) {
      if(error instanceof Error) { return NextResponse.json({
            error : error.message,
            status : false
            
                    })
                }else{
                    return NextResponse.json({
                        error,
                        status : false
                        
                                })

                }
    }






    
}