import { Context, Schema, h } from 'koishi'

export const name = 'minecraft-skin'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command('mcuuid <id:string>', "获取minecraft玩家uuid")
    .action(async ({ session }, id) => {
      const uuid = (await ctx.http.get(`https://api.mojang.com/users/profiles/minecraft/${id}`)).id
      if (uuid === undefined) return "找不到该玩家"
      session.send(`${id} 的uuid是：${uuid}`)
    })

  ctx.command('mcskin <id:string>', '获取Minecraft玩家皮肤')
    .option('avatars', '-a 获取头像')
    .option('head', '-t 获取头颅')
    .option('body', '-b 获取整个身体')
    .option('capes', '-c 获取披风')
    .option('skins', '-s 获取皮肤')
    .action(async ({ session, options }, id) => {
      const uuid = (await ctx.http.get(`https://api.mojang.com/users/profiles/minecraft/${id}`)).id
      if (uuid === undefined) return "找不到该玩家"
      let result = ""
      for (const key of Object.keys(options)) {
        if (options[key]) {
          let image = await ctx.http.get(`https://crafatar.com/${key === "head" || key === "body" ? "renders/" + key : key}/${uuid}`, {responseType: "arraybuffer"})
          result += h.image(image, "image/png")
        }
      }
      if (result === "") result = "请至少选择一个选项，输入 help mcskin 获取帮助"
      session.send(result)
    })
}
