'use client'

import React, { useState, useEffect } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function virtualize(element: HTMLElement) {
  const result: { type: string; props: { [key: string]: any } } = {
    type: element.tagName.toLowerCase(),
    props: {}
  };

  for (let attr of element.attributes) {
    const name = attr.name === 'class' ? 'className' : attr.name;
    result.props[name] = attr.value;
  }

  const children = [];
  for (let node of element.childNodes) {
    if (node.nodeType === 3) {
      children.push(node.textContent);
    } else if (node instanceof HTMLElement) {
      children.push(virtualize(node));
    }
  }

  result.props.children = children.length === 1 ? children[0] : children;

  return result;
}

function render(json: any): HTMLElement | Text {
  if (typeof json === 'string') {
    return document.createTextNode(json);
  }

  const { type, props: { children, ...attrs } } = json;
  const element = document.createElement(type);

  for (let [attr, value] of Object.entries(attrs)) {
    if (attr === 'className') {
      element.classList.add(value as string);
    } else {
      element.setAttribute(attr, value as string);
    }
  }

  const childrenArr = Array.isArray(children) ? children : [children];
  childrenArr.forEach(child => {
    element.append(render(child));
  });

  return element;
}

export default function VirtualDOMDemo() {
  const [input, setInput] = useState('<div><h1>Hello</h1><p>World</p></div>')
  const [virtualDOM, setVirtualDOM] = useState<any>(null)
  const [renderedHTML, setRenderedHTML] = useState('')

  useEffect(() => {
    if (virtualDOM) {
      const rendered = render(virtualDOM)
      setRenderedHTML(rendered.outerHTML)
    }
  }, [virtualDOM])

  const handleVirtualize = () => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = input
    const virtualized = virtualize(tempDiv.firstElementChild as HTMLElement)
    setVirtualDOM(virtualized)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Virtual DOM Demo</CardTitle>
        <CardDescription>Enter HTML, virtualize it, and see it rendered back</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter HTML here"
            rows={5}
          />
          <Button onClick={handleVirtualize}>Virtualize</Button>
          {virtualDOM && (
            <>
              <div>
                <h3 className="text-lg font-semibold">Virtualized Object:</h3>
                <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(virtualDOM, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Rendered HTML:</h3>
                <div className="bg-gray-100 p-2 rounded" dangerouslySetInnerHTML={{ __html: renderedHTML }} />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

