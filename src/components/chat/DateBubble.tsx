interface DateBubbleProps {
  date: string;
}

export function DateBubble({ date }: DateBubbleProps) {
  return (
    <div className="text-center my-2">
      <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-full">
        {date}
      </span>
    </div>
  );
}
