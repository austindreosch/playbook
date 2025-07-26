'use client';

import * as React from 'react';
import Link from 'next/link';
import { RiSearch2Line } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as ScrollArea from '@/components/ui/scroll-area';
import * as Tooltip from '@/components/ui/tooltip';

import IconInfoCustom from '~/icons/icon-info-custom-fill.svg';

type MyProductsData = {
  id: string;
  image: string;
  name: string;
  description: string;
};

const myProductsData: MyProductsData[] = [
  {
    id: 'fd5b7a3f-53c0-4024-8ec7-2dfc84c9260b',
    name: 'Apple Watch S5 GPS 40mm White',
    image: '/images/products/apple-watch-1.png',
    description: '500 units sold to date',
  },
  {
    id: '8245d3bf-517c-4ac4-8ae3-db78c1406c0e',
    name: 'MacBook Pro M1 256GB Silver',
    image: '/images/products/macbook-1.png',
    description: '960 units sold to date',
  },
  {
    id: 'ad8a2b2d-c40c-4ef6-983c-0cac00aeb957',
    name: 'iMac M1 24-inch Purple',
    image: '/images/products/imac-1.png',
    description: '648 units sold to date',
  },
  {
    id: '0c5dc9be-a317-4912-b474-1c78ecdb0350',
    name: 'AirPods Max Green',
    image: '/images/products/airpods-max-1.png',
    description: '243 units sold to date',
  },
  {
    id: '2dcc424f-552a-41e0-9174-1463ca89c239',
    name: 'HomePod Mini Orange',
    image: '/images/products/homepod-mini-1.png',
    description: '56 units sold to date',
  },
  {
    id: 'f25f22b1-6a56-4205-a154-118fb3785c49',
    name: 'iPad Pro 12.9-inch with M2 chip',
    image: '/images/products/ipad-pro-1.png',
    description: '405 units sold to date',
  },
  {
    id: '799d5a20-7e9a-4709-a1ed-169b619b09b3',
    name: 'Apple Studio Display Standard Glass',
    image: '/images/products/apple-studio-display-1.png',
    description: '44 units sold to date',
  },
  {
    id: '9f956574-976d-45d4-a464-df8cb2a86ebe',
    name: 'Apple AirPods Pro 2nd Gen',
    image: '/images/products/airpods-pro-1.png',
    description: '120 units sold to date',
  },
];

export function WidgetMyProducts() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredProducts, setFilteredProducts] =
    React.useState<MyProductsData[]>(myProductsData);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setFilteredProducts(myProductsData);
    } else {
      setFilteredProducts(
        myProductsData.filter(
          (product) =>
            product.name.toLowerCase().includes(value.toLowerCase()) ||
            product.description.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    }
  };

  return (
    <div className='relative flex w-full flex-col overflow-hidden rounded-2xl bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex items-start gap-2 p-5 pb-4'>
        <div className='flex-1'>
          <div className='flex items-center gap-1'>
            <div className='text-label-sm text-text-sub-600'>My Products</div>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <IconInfoCustom className='size-5 text-text-disabled-300' />
              </Tooltip.Trigger>
              <Tooltip.Content className='max-w-80'>
                View and track the sales performance of your products, including
                details like units sold and product names.
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>468</div>
            <div className='text-label-sm text-text-sub-600'>
              <span className='text-success-base'>+2.1%</span> vs last week
            </div>
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall' asChild>
          <Link href='#'>See All</Link>
        </Button.Root>
      </div>

      <div className='h-11 w-full  border-y border-stroke-soft-200 px-5'>
        <div className='group relative flex h-full w-full items-center'>
          <RiSearch2Line className='pointer-events-none absolute left-0 top-1/2 size-5 -translate-y-1/2 text-text-soft-400 transition group-focus-within:text-text-sub-600' />
          <input
            type='text'
            placeholder='Search products...'
            value={searchTerm}
            onChange={handleSearch}
            className={cn(
              'w-full bg-transparent bg-none pl-[30px] text-paragraph-sm text-text-strong-950 caret-primary-base focus:outline-none',
              'placeholder:text-text-soft-400',
            )}
          />
        </div>
      </div>

      <div className='w-full pb-px pr-px'>
        <ScrollArea.Root
          type='auto'
          className='h-[243px] overflow-hidden rounded-br-2xl'
        >
          <ScrollArea.Viewport className='h-full w-full'>
            {filteredProducts.map(({ id, name, image, description }) => (
              <div
                key={id}
                className='flex items-center gap-3.5 border-b border-stroke-soft-200 px-4 py-3 last:border-b-0'
              >
                <img
                  src={image}
                  alt=''
                  className='size-10 shrink-0 object-contain'
                />
                <div className='flex-1'>
                  <div className='text-label-sm text-text-strong-950'>
                    {name}
                  </div>
                  <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                    {description}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea.Viewport>
          <ScrollArea.ScrollbarVertical />
        </ScrollArea.Root>
      </div>
    </div>
  );
}
