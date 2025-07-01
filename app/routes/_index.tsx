import type { MetaFunction } from "@remix-run/node";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData, useFetcher } from "@remix-run/react";
import { getTodos, addTodo, deleteTodo } from "~/utils/db.server";

export async function loader({}: LoaderFunctionArgs) {
  const todos = getTodos();
  return json({ todos });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const _method = formData.get("_method");

  if (_method === "delete") {
    const id = formData.get("id")?.toString();

    if (id) {
      deleteTodo(id);
    }

    return null;
  }

  if (_method === "create") {
    const title = formData.get("title")?.toString();
    if (title) addTodo(title);
    return null;
  }

  return null;
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { todos } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">📋 ToDo List</h1>

      <fetcher.Form method="post" className="flex gap-2 mb-4">
        <input type="hidden" name="_method" value="create" />
        <input
          type="text"
          name="title"
          placeholder="Nova tarefa..."
          className="flex-1 border p-2 rounded"
        />
        <button className="bg-blue-600 text-white px-4 rounded">
          Adicionar
        </button>
      </fetcher.Form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>{todo.title}</span>

            <Form method="post">
              <input type="hidden" name="_method" value="delete" />
              <input type="hidden" name="id" value={todo.id} />
              <button className="text-red-500">Excluir</button>
            </Form>
          </li>
        ))}
      </ul>
    </main>
  );
}
