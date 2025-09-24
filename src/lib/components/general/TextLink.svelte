<script lang="ts">
  export let text: string;
  export let linkText: string;
  export let href: string = '#';
  export let align: 'left' | 'center' | 'right' = 'center';
</script>

<p
  class={`flex items-center gap-2 text-[14px] leading-5 ${
    align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'
  }`}
>
  <span class="font-normal text-[var(--color-black-300)]">{text}</span>

  <a
    href={href}
    class="font-bold underline decoration-solid
           text-[14px] leading-5
           text-[var(--color-purple-500)]
           hover:text-[var(--color-purple-700)]
           focus-ring rounded-[4px]"
  >
    {linkText}
  </a>
</p>