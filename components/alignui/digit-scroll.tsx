type DigitScrollProps = {
  value: string;
  size: string;
};

export function DigitScroll({ value, size }: DigitScrollProps) {
  return (
    <div
      className='inline-flex justify-center overflow-hidden'
      style={{ height: size, fontSize: size, lineHeight: size }}
    >
      {value.split('').map((val, i) => (
        <div
          key={i}
          className='transition-all duration-1000'
          style={{
            transform: `translate3d(0, -${val}em, 0)`,
            transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          <div data-val='0'>0</div>
          <div data-val='1'>1</div>
          <div data-val='2'>2</div>
          <div data-val='3'>3</div>
          <div data-val='4'>4</div>
          <div data-val='5'>5</div>
          <div data-val='6'>6</div>
          <div data-val='7'>7</div>
          <div data-val='8'>8</div>
          <div data-val='9'>9</div>
        </div>
      ))}
    </div>
  );
}
