import React from 'react'
import { Card, CardContent } from '../ui/card'

const StatCard = ({
    title,
    value,
    subTitle,
    textColor = "text-color-600",
    borderColor = "border-blur-600",
    bgColor = "bg-white" }) => {
    return (
        <Card className={` w-full min-w-0 border-l-4 ${borderColor} ${bgColor}`} >
            <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground truncate">
                    {title}
                </p>

                <h2 className={`mt-2 text-xl md:text-2xl font-bold break-words ${textColor}`} >
                    {value}
                </h2>
            </CardContent>
        </Card>
    )
}

export default StatCard;