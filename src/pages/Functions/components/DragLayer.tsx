import { useDragLayer } from "react-dnd";

export default function DragLayer() {
  const { item, isDragging, currentOffset } = useDragLayer((monitor) => {
    return {
      item: monitor.getItem(),
      isDragging: monitor.isDragging(),
      currentOffset: monitor.getSourceClientOffset(),
    };
  });

  if (!isDragging) {
    return null;
  }

  return (
    <div
      className="fixed"
      style={{
        left: currentOffset?.x,
        top: currentOffset?.y,
      }}
    >
      {item.name}
    </div>
  );
}
