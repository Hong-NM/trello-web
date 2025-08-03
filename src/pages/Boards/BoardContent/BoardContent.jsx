import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import  { mapOrder } from '~/utils/sorts'
import  {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import  {arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import  Card from './ListColumns/Column/ListCards/Card/Card'



const ACTIVE_DRAG_ITEM_TYPE ={
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  
  // const pointerSensor = useSensor(PointerSensor,{activationConstraint: {distance: 10}})

  // Yêu cầu chuột di chuyển trền 10px mới kích hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor,{activationConstraint: {distance: 10}})

  // Nhấn giữ 250ms mới kích hoạt event, fix trường hợp click bị gọi event và dung sai của cảm ứng là 500 để kéo thả tốt hơn trên mobile
  const touchSensor = useSensor(TouchSensor,{activationConstraint: {delay: 250, tolerance: 500}})

  const sensors = useSensors(mouseSensor, touchSensor)


  const [orderedColumns, setOrderedColumns] = useState([])

  // cùng 1 thời điểm chỉ có 1 phần tử được kéo thả (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
      setOrderedColumns(mapOrder(board.columns, board.columnOrderIds, '_id'))
  }, [board])

    // Trigger khi bắt đầu kéo 1 phần tử (có thể là column hoặc card)
  const handleDragStart = (event) => {
    // console.log('handDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ?
      ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    
  }


  // Trigger khi kết thúc kéo 1 phần tử (có thể là column hoặc card)
  const handleDragEnd = (event) => {
    console.log('handDragEnd', event)
    const {active, over} = event

    // Nếu không có over (không kéo thả vào đâu cả) thì không làm gì
    if(!over) return

    // Nếu vị trí kéo thả khác với vị trí ban đầu 
    if(active.id !== over.id) {
      // Lấy vị trí cũ (từ thằng active)
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // Lấy vị trí mới (từ thằng over)
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      // Dùng arrayMove của dnd-kit để sắp xếp lại mảng Columns ban đầu
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)


      // 2 console.log dưới dùng để xử lý gọi API
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns', dndOrderedColumns)
      // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds)

      // Cập nhật lại state orderedColumns sau khi đã kéo thả
      setOrderedColumns(dndOrderedColumns)
    }

    setActiveDragItemData(null)
    setActiveDragItemId(null) 
    setActiveDragItemType(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5'}}
    })
  }

  return (
    <DndContext 
      onDragEnd={handleDragEnd} 
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <Box sx={{
        bgcolor: (theme) => ( theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight ,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemData) && null }
          {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
           {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
      
  )
}
export default BoardContent

