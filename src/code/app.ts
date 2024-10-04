export class App {
    public run(): void {
        const grid = document.getElementById("grid");
        var step = 20;

        for (let width = 0; width < 20; width++) {
            for (let height = 0; height < 20; height++) {
                const rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                rect.setAttribute('x', (step * width).toString());
                rect.setAttribute('y', (step * height).toString());
                rect.setAttribute('rx', "5");
                rect.setAttribute('ry', "5");
                rect.setAttribute('width', step.toString());
                rect.setAttribute('height', step.toString());
                rect.setAttribute('fill', 'white');
                rect.setAttribute('stroke', 'grey');
                grid?.appendChild(rect);

                rect.onmouseenter = (ms) => {
                    if (ms.buttons === 1)
                        rect.style.fill = "red";
                };

                rect.onmousedown = (_) => {
                    rect.style.fill = "red";
                }
            }
        }

    }
}