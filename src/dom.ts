declare var document: any;
declare var window: any;

/**
 * 移动元素
 * @param elBar 触发拖动元素
 * @param elBox 被拖动元素
 * @param moveX 是否允许左右移动
 * @param overflow 是否被移出屏幕
 */
export const moveElement = (
  elBar: any,
  elBox: any,
  overflowY: boolean = false
) => {
  let isMouseDown = false;
  if (elBar) {
    elBar.onmousedown = (b: any) => {
      b.preventDefault();
      isMouseDown = true;
      let initX = b.offsetX;
      let initY = b.offsetY;
      let height = elBox.offsetHeight;
      let width = elBox.offsetWidth;
      document.onmousemove = (b: any) => {
        if (isMouseDown) {
          document.body.classList.add("no-select");
          let cx = b.clientX - initX,
            cy = b.clientY - initY;
          if (cx < 0) {
            cx = 0;
          }
          if (cy < 0) {
            cy = 0;
          }
          if (window.innerWidth - b.clientX + initX < width) {
            cx = window.innerWidth - width;
          }
          if (b.clientY > window.innerHeight - height + initY && !overflowY) {
            cy = window.innerHeight - height;
          }
          elBox.style.left = cx + "px";
          elBox.style.top = cy + "px";
        }
      };
      document.onmouseup = () => {
        isMouseDown = false;
        document.onmouseup = null;
        document.onmousemove = null;
        document.body.classList.remove("no-select");
      };
    };
  }
};
