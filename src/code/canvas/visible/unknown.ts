import {
    DotHoveredEvent,
    DotUnhoveredEvent,
    DrawLinkEvent,
    IVirtualCanvas,
    RemoveLinkEvent,
    MousePositionType
} from "../virtual/types.js";

export class UnknownCanvas {
    private dots: Map<string, SVGCircleElement>;
    private links: Map<string, SVGLineElement>;


    constructor(
        private svgCanvas: HTMLElement,
        private virtualCanvas: IVirtualCanvas) {

        this.links = new Map<string, SVGLineElement>();
        this.dots = new Map<string, SVGCircleElement>();

        this.virtualCanvas.onDrawLink(this.handleDrawLink.bind(this));
        this.virtualCanvas.onRemoveLink(this.handleRemoveLink.bind(this));
        this.virtualCanvas.onDotHovered(this.handleDotHovered.bind(this));
        this.virtualCanvas.onDotUnhovered(this.handleDotUnhovered.bind(this));
    }

    private handleDotHovered(event: DotHoveredEvent): void {
        const dot = event.dot;
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        circle.setAttribute("cx", dot.x.toString());
        circle.setAttribute("cy", dot.y.toString());
        circle.setAttribute("r", dot.radius.toString());
        circle.setAttribute("fill", "gray");

        // Append the circle to the SVG element
        this.svgCanvas.appendChild(circle);
        this.dots.set(dot.id.toString(), circle);
    }

    private handleDotUnhovered(event: DotUnhoveredEvent): void {
        const dotId = event.dot.id.toString();
        if (this.dots.has(dotId)) {
            const circle = this.dots.get(dotId)!;
            this.svgCanvas.removeChild(circle);
            this.dots.delete(dotId);
        }
    }

    private handleDrawLink(event: DrawLinkEvent): void {
        const link = event.link;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

        const from = link.from;
        line.setAttribute('x1', from.x.toString());
        line.setAttribute('y1', from.y.toString());

        const to = link.to;
        line.setAttribute('x2', to.x.toString());
        line.setAttribute('y2', to.y.toString());

        line.setAttribute('stroke', 'red');
        line.setAttribute('stroke-width', from.radius.toString());

        if (link.type === MousePositionType.BACK) {
            line.setAttribute("stroke-dasharray", "5,2");
        }

        this.svgCanvas.appendChild(line);
        this.links.set(link.id.toString(), line);
    }

    private handleRemoveLink(even: RemoveLinkEvent): void {
        const lineId = even.link.id.toString();
        if (this.links.has(lineId)) {
            const line = this.links.get(lineId)!;
            this.svgCanvas.removeChild(line);
            this.links.delete(lineId);
        }
    }
}