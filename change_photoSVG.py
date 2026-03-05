"""
change_photoSVG.py — BuildCode Icon Converter
================================================
Converte imagens (PNG, JPG, WEBP) em SVGs otimizados para ícones.
Remove fundo, redimensiona e gera SVG vetorizado limpo.

Uso:
  python change_photoSVG.py imagem.png
  python change_photoSVG.py imagem1.png imagem2.jpg logo.webp
  python change_photoSVG.py pasta/              (processa todas as imagens da pasta)

Dependências (instale se necessário):
  pip install Pillow rembg vtracer
"""

import sys
import os
import subprocess
from pathlib import Path

# ─── Config ───────────────────────────────────────────
ICON_SIZE = 128          # Resolução ideal para ícones web (128x128)
SUPPORTED_EXT = {'.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff'}


def check_dependencies():
    """Verifica e instala dependências automaticamente."""
    deps = {
        'rembg': 'rembg[cpu]',
        'vtracer': 'vtracer',
        'PIL': 'Pillow',
    }
    missing = []
    for module, package in deps.items():
        try:
            __import__(module)
        except ImportError:
            missing.append(package)

    if missing:
        print(f"⚙️  Instalando dependências: {', '.join(missing)}")
        subprocess.check_call(
            [sys.executable, '-m', 'pip', 'install', *missing, '-q'],
            stdout=subprocess.DEVNULL
        )
        print("✅ Dependências instaladas!\n")


def remove_background(img):
    """Remove o fundo da imagem usando rembg."""
    from rembg import remove
    return remove(img)


def resize_icon(img, size=ICON_SIZE):
    """Redimensiona mantendo aspect ratio, centralizado em canvas quadrado."""
    from PIL import Image

    # Garante RGBA
    img = img.convert('RGBA')

    # Calcula novo tamanho mantendo proporção
    w, h = img.size
    ratio = min(size / w, size / h)
    new_w = int(w * ratio)
    new_h = int(h * ratio)

    # Resize com alta qualidade
    img = img.resize((new_w, new_h), Image.LANCZOS)

    # Centraliza em canvas quadrado transparente
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    offset_x = (size - new_w) // 2
    offset_y = (size - new_h) // 2
    canvas.paste(img, (offset_x, offset_y), img)

    return canvas


def image_to_svg(img, output_path):
    """Converte imagem RGBA para SVG vetorizado usando vtracer."""
    import vtracer
    import tempfile

    # Salva como PNG temporário (vtracer precisa de arquivo)
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
        tmp_path = tmp.name
        img.save(tmp_path, 'PNG')

    try:
        # Vetoriza com configurações otimizadas para ícones
        svg_str = vtracer.convert_image_to_svg_py(
            tmp_path,
            colormode='color',          # Preserva cores
            hierarchical='stacked',     # Melhor para ícones
            mode='spline',              # Curvas suaves
            filter_speckle=4,           # Remove ruído/sujeira
            color_precision=6,          # Boa fidelidade de cor
            layer_difference=16,        # Agrupamento de cores
            corner_threshold=60,        # Cantos mais suaves
            length_threshold=4.0,       # Detalhe mínimo
            max_iterations=10,          # Qualidade de otimização
            splice_threshold=45,        # Junção de paths
            path_precision=3,           # Precisão decimal dos paths
        )

        # Salva SVG
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(svg_str)

    finally:
        os.unlink(tmp_path)


def process_image(image_path):
    """Pipeline completo: remove fundo → redimensiona → converte SVG → apaga original."""
    from PIL import Image

    path = Path(image_path)

    if path.suffix.lower() not in SUPPORTED_EXT:
        print(f"⏭️  Ignorado (formato não suportado): {path.name}")
        return False

    print(f"🔄 Processando: {path.name}")

    try:
        # 1. Carregar imagem
        img = Image.open(path).convert('RGBA')
        print(f"   📐 Original: {img.size[0]}x{img.size[1]}")

        # 2. Remover fundo
        print("   🧹 Removendo fundo...")
        img = remove_background(img)

        # 3. Redimensionar para ícone
        print(f"   📏 Redimensionando para {ICON_SIZE}x{ICON_SIZE}...")
        img = resize_icon(img, ICON_SIZE)

        # 4. Converter para SVG
        svg_path = path.with_suffix('.svg')
        print(f"   🎨 Vetorizando para SVG...")
        image_to_svg(img, str(svg_path))

        # 5. Verificar tamanho do SVG
        svg_size = os.path.getsize(svg_path)
        original_size = os.path.getsize(path)
        print(f"   📊 {original_size / 1024:.1f}KB → {svg_size / 1024:.1f}KB SVG")

        # 6. Apagar original
        os.remove(path)
        print(f"   🗑️  Original removido: {path.name}")
        print(f"   ✅ Pronto: {svg_path.name}\n")
        return True

    except Exception as e:
        print(f"   ❌ Erro: {e}\n")
        return False


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        print("Erro: Informe ao menos uma imagem ou pasta como argumento.")
        sys.exit(1)

    # Verifica dependências
    check_dependencies()

    # Coleta todos os arquivos a processar
    files = []
    for arg in sys.argv[1:]:
        p = Path(arg)
        if p.is_dir():
            for ext in SUPPORTED_EXT:
                files.extend(p.glob(f'*{ext}'))
                files.extend(p.glob(f'*{ext.upper()}'))
        elif p.is_file():
            files.append(p)
        else:
            print(f"⚠️  Não encontrado: {arg}")

    if not files:
        print("Nenhuma imagem encontrada para processar.")
        sys.exit(1)

    print(f"{'═' * 50}")
    print(f"  BuildCode — Icon Converter")
    print(f"  {len(files)} arquivo(s) para processar")
    print(f"{'═' * 50}\n")

    success = 0
    for f in files:
        if process_image(str(f)):
            success += 1

    print(f"{'═' * 50}")
    print(f"  ✅ {success}/{len(files)} convertidos com sucesso!")
    print(f"{'═' * 50}")


if __name__ == '__main__':
    main()
