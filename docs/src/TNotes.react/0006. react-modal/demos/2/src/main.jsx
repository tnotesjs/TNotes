import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Modal from 'react-modal'
import iconCloseBtn from './icon--close-btn.svg'

Modal.setAppElement('#root') // 设置应用根元素

const MyModal = ({
  isOpen,
  onRequestClose,
  width = '480px',
  height = '280px',
  children,
  showCloseButton = true,
}) => {
  const customStyles = {
    content: {
      width,
      height,
      // 居中
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      // 渐变背景
      background: 'linear-gradient(to bottom, #D9FAFC, #E6FBFF, #FFFFFF)',
      // 添加相对定位以便子元素绝对定位
      position: 'relative',
      // 确保内边距和边框包含在宽度和高度内
      boxSizing: 'border-box',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Custom Modal"
    >
      {showCloseButton && (
        <img
          onClick={onRequestClose}
          title="关闭"
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          src={iconCloseBtn}
        />
      )}
      {children}
    </Modal>
  )
}

const App = () => {
  const [modalIsOpen, setIsOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  function handleCancel() {
    console.log('cancel')
    closeModal()
  }

  function handleConfirm() {
    console.log('confirm')
    closeModal()
  }

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <MyModal isOpen={modalIsOpen} onRequestClose={handleCancel}>
        <h2>自定义模态框标题</h2>
        <p>这是自定义模态框的内容。</p>
        <button onClick={handleConfirm}>confirm</button>
        <button onClick={handleCancel}>cancel</button>
      </MyModal>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
