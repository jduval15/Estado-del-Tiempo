import './styles/loading.css'
const Loading = () => {
  return (
    <article className='contenedorLoader'>
      <div className='loader_total'>
        <span className="loader"></span>
      </div>
      <p>Enable Location to use Weather App.</p>
    </article>
  )
}
export default Loading