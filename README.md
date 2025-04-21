# 🛠️ Kit Enchantment Normalizer

**Fixes broken enchantment formatting in zEssentials kits for Folia 1.21.4**

---

## ❓ What is this?

This Node.js script normalizes enchantment names in `.yml` kit files exported by `/kiteditor` in [zEssentials](https://github.com/zDevelopers/zEssentials).

It solves an issue where enchantments are saved in an **incompatible Bukkit format** (e.g. `PROTECTION_ENVIRONMENTAL`) instead of the expected **alias format** (e.g. `protection`), which causes `ItemEnchantException` when loading kits in **Folia 1.21.4**.

> 💡 Reference: [GitHub Issue #173](https://github.com/zDevelopers/zEssentials/issues/173)

---

## 🔧 Problem

When saving a kit using `/kiteditor`, enchantments are saved using full Bukkit-style names in uppercase (e.g. `DAMAGE_ALL: 5`).  
However, the zEssentials loader expects **lowercase aliases** like `sharpness`, `protection`, etc.

This mismatch causes **kits to break** upon reload or restart with errors like:

```
ItemEnchantException: Cannot parse enchantment DAMAGE_ALL
```

---

## ✅ What this script does

- Converts enchantment names like `PROTECTION_ENVIRONMENTAL,4` to `protection,4`
- Reads raw `.yml` kit files from a `raw/` directory
- Writes processed (compatible) `.yml` files into a `processed/` directory
- Archives the original raw files into `archived/` for backup

---

## 📁 Folder Structure

```
your-project/
├── enchant-map.json       # Mapping of Bukkit names → aliases
├── index.js               # The main processing script
├── raw/                   # Place raw .yml files here
├── processed/             # Output directory for converted kits
└── archived/              # Backup of original raw files
```

---

## 🚀 How to use

1. **Install dependencies**

Make sure you have [Node.js](https://nodejs.org/) installed (v14+), then run:

```bash
npm install
```

2. **Place your `.yml` kit files** into the `raw/` folder.

3. **Run the script**

```bash
npm start
```

4. **Result**

- Fixed kits will appear in `processed/`
- Originals are moved to `archived/`

---

## 📋 Example `enchant-map.json`

```json
{
	"PROTECTION_ENVIRONMENTAL": "protection",
	"DAMAGE_ALL": "sharpness",
	"ARROW_DAMAGE": "power",
	"ARROW_FIRE": "flame",
	"ARROW_INFINITE": "infinity"
}
```

Add more mappings as needed.

---

## 🧩 Dependencies

- [js-yaml](https://www.npmjs.com/package/js-yaml)

---

## 🐛 Related Issue

- [#173 · Kit editor saves enchantments in incompatible format](https://github.com/Maxlego08/zEssentials/issues/173)
