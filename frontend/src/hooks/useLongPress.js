export default function useLongPress() {
  const [action, setAction] = useState();

  const timerRef = useRef();
  const isLongPress = useRef();

  function startPressTimer() {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setAction("longpress");
    }, 500);
  }

  function handleOnClick(e) {
    if (isLongPress.current) {
      return;
    }
    setAction("click");
  }

  function handleOnMouseDown() {
    startPressTimer();
  }

  function handleOnMouseUp() {
    clearTimeout(timerRef.current);
  }

  function handleOnTouchStart() {
    startPressTimer();
  }

  function handleOnTouchEnd() {
    if (action === "longpress") return;
    clearTimeout(timerRef.current);
  }

  return {};
}
